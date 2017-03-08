// @flow
import { List } from 'immutable';
import Grammar, { idForElement, makeElement } from '../Grammar';
import { genId } from '../../util';
import type { createElementsResult } from '../Grammar';

export const repetitionTypeTag = 'REPETITION';

export type RepetitionElementData = {
  termToRepeat: 'string',
  childElementIds: List<string>,
};

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
