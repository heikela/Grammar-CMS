// @flow
import { List } from 'immutable';
import Grammar, { idForElement, makeElement } from '../Grammar';
import type { createElementsResult } from '../Grammar';

export const repetitionTypeTag = 'REPETITION';

export type RepetitionElementData = {
  termToRepeat: 'string',
  childElementIds: List<string>,
};

export const appendChild = (
  data: RepetitionElementData,
  newElementId: string,
): RepetitionElementData => ({
  termToRepeat: data.termToRepeat,
  childElementIds: data.childElementIds.push(newElementId),
});

const RepetitionType = {
  typeTag: repetitionTypeTag,
  expansionType: {
    typeTag: repetitionTypeTag,
    initialiser: (
      rootElementId: string,
      termToRepeat: string,
      grammar: ?Grammar,
    ): createElementsResult => {
      return [
        idForElement(
          rootElementId,
          makeElement(repetitionTypeTag, {
            termToRepeat: termToRepeat,
            childElementIds: List(),
          }),
        ),
      ];
    },
  },
};

export default RepetitionType;
