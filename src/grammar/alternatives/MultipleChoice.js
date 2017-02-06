// @flow

export const multipleChoiceTermType = 'MULTIPLE_CHOICE';

class MultipleChoice {
  typeTag: string;
  alternatives: Array<string>;

  constructor(alternatives: Array<string>) {
    this.typeTag = multipleChoiceTermType;
    this.alternatives = alternatives;
  }
}

export default MultipleChoice;
