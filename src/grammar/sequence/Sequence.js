// @flow
import { Map } from 'immutable';
import Grammar, { idForElement, makeElement } from '../Grammar';
import { genId } from '../../util';
import type { createElementsResult } from '../Grammar';

export const sequenceTypeTag = 'SEQUENCE';
type sequenceTypeTagType = 'SEQUENCE' // has to be same value as the const above

export type SequenceElementData = {
  fields: Array<string>,
  childElementIds: Map<string, string>,
};

export type SequenceElementType = {
  typeTag: sequenceTypeTagType,
  data: SequenceElementData
}

const SequenceType = {
  typeTag: sequenceTypeTag,
  expansionType: {
    typeTag: sequenceTypeTag,
    initialiser: (
      rootElementId: string,
      fieldList: Array<string>,
      grammar: ?Grammar,
    ): createElementsResult => {
      if (grammar) {
        let g = grammar;
        let elements = [];
        let childElementIds = Map();
        fieldList.forEach(field => {
          const elementId = genId('elem');
          const elementsForField = g.createElements(field, elementId);
          elements = elements.concat(elementsForField);
          childElementIds = childElementIds.set(field, elementId);
        });
        return elements.concat([
          idForElement(
            rootElementId,
            makeElement(sequenceTypeTag, {
              fields: fieldList,
              childElementIds: childElementIds,
            }),
          ),
        ]);
      } else {
        throw new Error('cannot instantiate a term sequence without a grammar');
      }
    },
  },
};

export default SequenceType;
