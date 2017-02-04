// @flow
import MultipleChoice from './MultipleChoice';

const alternativesTypeTag = 'ALTERNATIVES';

const Alternatives = {
  expansionType: {
    typeTag: alternativesTypeTag,
    initialiser: (alternatives: Array<string>) =>
      new MultipleChoice(alternatives),
  },
  typeTag: alternativesTypeTag,
};

export default Alternatives;
