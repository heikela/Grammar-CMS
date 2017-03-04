// @flow
import MultipleChoice from './MultipleChoice';

export const alternativesTypeTag = 'ALTERNATIVES';

const Alternatives = {
  expansionType: {
    typeTag: alternativesTypeTag,
    initialiser: (rootElementId: string, alternatives: Array<string>) => [
      {
        elementId: rootElementId,
        element: {
          typeTag: alternativesTypeTag,
          data: new MultipleChoice(alternatives),
        },
      },
    ],
  },
  typeTag: alternativesTypeTag,
};

export default Alternatives;
