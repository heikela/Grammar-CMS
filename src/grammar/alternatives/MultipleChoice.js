// @flow

const multipleChoiceTermType = 'MULTIPLE_CHOICE';

class MultipleChoice {
  termType: string;
  alternatives: Array<string>;

  constructor(alternatives: Array<string>) {
    this.termType = multipleChoiceTermType;
    this.alternatives = alternatives;
  }
}

export default MultipleChoice;
