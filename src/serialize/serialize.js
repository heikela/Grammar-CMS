// @flow

import { getElement } from '../DocumentEditor/DocumentEditorState';
import type {
  documentEditorState,
} from '../DocumentEditor/DocumentEditorState';
import { alternativesTypeTag } from '../grammar/alternatives/Alternatives';
import MultipleChoice from '../grammar/alternatives/MultipleChoice';
import { constantTypeTag } from '../grammar/constant/Constant';
import { sequenceTypeTag } from '../grammar/sequence/Sequence';
import { repetitionTypeTag } from '../grammar/repetition/Repetition';
import type { SequenceElementData } from '../grammar/sequence/Sequence';
import type { RepetitionElementData } from '../grammar/repetition/Repetition';
import { textFieldTypeTag } from '../grammar/textField/TextField';

export const serialize = (
  state: documentEditorState,
  documentId: string,
  elementId: string,
) => {
  const element = getElement(state, documentId, elementId);
  if (!element) return null;
  switch (element.typeTag) {
    case alternativesTypeTag:
      const alternativesData: MultipleChoice = element.data;
      if (alternativesData.selectedAlternative) {
        const alternative = alternativesData.selectedAlternative.chosenAlternative;
        const childElementId = alternativesData.selectedAlternative.childElementId;
        return {
          [alternative]: serialize(state, documentId, childElementId),
        };
      } else {
        return null;
      }
    case constantTypeTag:
      return element.data;
    case sequenceTypeTag:
      const sequenceData: SequenceElementData = element.data;
      const result = {};
      sequenceData.fields.forEach(field => {
        result[field] = serialize(
          state,
          documentId,
          sequenceData.childElementIds.get(field),
        );
      });
      return result;
    case repetitionTypeTag:
      const repetitionData: RepetitionElementData = element.data;
      return repetitionData.childElementIds.map(id =>
        serialize(state, documentId, id));
    case textFieldTypeTag:
      return element.data.value;
    default:
      throw new Error(
        'Cannot serialize unknown element type with typeTag=' +
          element.typeTag +
          "'",
      );
  }
};
