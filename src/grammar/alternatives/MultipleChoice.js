// @flow

type choice = {
  chosenAlternative: string,
  childElementId: string,
};

class MultipleChoice {
  alternatives: Array<string>;
  selectedAlternative: ?choice;

  constructor(
    alternatives: Array<string>,
    selectedAlternative: ?choice = null,
  ) {
    this.alternatives = alternatives;
    this.selectedAlternative = selectedAlternative;
  }

  select(alternative: string, newElementId: string) {
    return new MultipleChoice(this.alternatives, {
      chosenAlternative: alternative,
      childElementId: newElementId,
    });
  }

  deselect() {
    return new MultipleChoice(this.alternatives);
  }
}

export default MultipleChoice;
