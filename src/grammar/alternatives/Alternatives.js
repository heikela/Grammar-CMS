// @flow
import MultipleChoice from './MultipleChoice';

const alternativesTypeTag = 'ALTERNATIVES';

const Alternatives = {
  expansionType: {
    expansionTypeTag: alternativesTypeTag,
    initialiser: (alternatives: Array<string>) =>
      new MultipleChoice(alternatives),
  },
  typeTag: alternativesTypeTag,
};

export default Alternatives;
