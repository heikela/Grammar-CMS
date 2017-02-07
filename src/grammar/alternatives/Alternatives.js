// @flow
import MultipleChoice from './MultipleChoice';

export const alternativesTypeTag = 'ALTERNATIVES';

const Alternatives = {
  expansionType: {
    typeTag: alternativesTypeTag,
    initialiser: (alternatives: Array<string>) =>
      new MultipleChoice(alternatives),
  },
  typeTag: alternativesTypeTag,
};

export default Alternatives;
