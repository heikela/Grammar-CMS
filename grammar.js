// import whyNotEqual from 'is-equal/why';

// Grammar classes
export class SequenceExpansion {
  constructor(termSequence) {
    this.termSequence = termSequence;
  }

  expand(grammar) {
    /* Design choice to revisit: here we have a choice
       whether we want to create sequences out of expansions with
       just one term on the right hand side: A = B.
    */
    var elements = {};
    for (let key of this.termSequence) {
      elements[key] = grammar.expandTerm(key)
    }
    return new SequenceElement(
      this.termSequence,
      elements
    );
  }

  toString() {
    return this.termSequence.join(' ');
  }
}

export class RepeatExpansion {
  constructor(termToRepeat) {
    this.termToRepeat = termToRepeat;
  }

  expand(grammar) {
    return new RepetitionElement(
      this.termToRepeat,
      []
    );
  }

  toString() {
    return this.termToRepeat + '*';
  }
}

export class Grammar {
  constructor(rules) {
    this.rules = rules
  }

  expandTerm(term) {
    const applicableRules = this.rules[term];
    if (applicableRules === undefined) {
      // For now, assume that a term without an expansion is a string terminal
      return new StringElement();
    } else if (applicableRules.length == 1) {
      const expansion = applicableRules[0];
      return expansion.expand(this);
    } else {
      return new IncompleteChoiceElement(applicableRules);
    }
  }

  initDocument() {
    return this.expandTerm('root');
  }
}

// Document and element classes
export class SequenceElement {
  constructor(keys, elements) {
    this.keys = keys;
    this.elements = elements;
  }

  get type() {
    return 'SEQUENCE';
  }

  updateElement(key, updated) {
    return new SequenceElement(
      this.keys,
      {
        ...this.elements,
        [key]: updated
      }
    )
  }
}

export class RepetitionElement {
  constructor(typeToRepeat, value = []) {
    this.typeToRepeat = typeToRepeat;
    this.value = value;
  }

  addNewElement(grammar) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.value,
        grammar.expandTerm(this.typeToRepeat)
      ]
    );
  }

  get type() {
    return 'REPETITION';
  }
}

export class StringElement {
  constructor() {
    this.value = '';
  }
  get type() {
    return 'STRING';
  }
}

export class IncompleteChoiceElement {
  constructor(alternateExpansions) {
    this.alternateExpansions = alternateExpansions;
  }

  get type() {
    return 'INCOMPLETE_CHOICE';
  }
}

const createElement = (term) => {
  return {
    type: 'UNKNOWN'
  }
}

export const addToRepetition = (grammar, document, path) => {
  if (path.length === 0) {
    if (document.type === 'REPETITION') {
      return document.addNewElement(grammar);
    } else {
      throw ('addToRepetition called for a non-sequence path');
    }
  } else {
    const currentKey = path[0];
    return document.updateElement(currentKey, addToRepetition(grammar, document.elements[currentKey], path.slice(1)));
  }
}

// Tests
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testaddToRepetition = () => {
  const documentBefore =
    new SequenceElement(
      ['title', 'questions'],
      {
        title: new StringElement(),
        questions:
          new RepetitionElement(
            'question',
            []
          )
      }
    );
  const grammar = new Grammar({}); // Would it be important for this to be a realistic grammar for the scenario?
  const documentAfter =
    new SequenceElement(
      ['title', 'questions'],
      {
        title: new StringElement(),
        questions:
          new RepetitionElement(
            'question',
            [
              new StringElement()
            ]
          )
      }
    );
  deepFreeze(documentBefore);
  deepFreeze(grammar);

  expect(
    addToRepetition(grammar, documentBefore, ['questions'])
  ).toEqual(documentAfter);
}
testaddToRepetition();

const testExpandTermForSequenceOfString = () => {
  const grammar = new Grammar({
    root: [new SequenceExpansion(['A', 'B'])]
  });
  deepFreeze(grammar);
  expect(
    grammar.expandTerm('root')
  ).toEqual(
    new SequenceElement(
      ['A', 'B'],
      {
        A: new StringElement(),
        B: new StringElement()
      }
    )
  )
}
testExpandTermForSequenceOfString();

const testExpandTermForRepetition = () => {
  const grammar = new Grammar({
    root: [new RepeatExpansion('A')]
  });
  deepFreeze(grammar);
  expect(
    grammar.expandTerm('root')
  ).toEqual(
    new RepetitionElement(
      'A',
      []
    )
  )
}
testExpandTermForRepetition();

const testExpandTermForMultipleExpansions = () => {
  const expansion1 = new RepeatExpansion('A');
  const expansion2 = new SequenceExpansion(['A', 'B']);
  const grammar = new Grammar({
    root: [expansion1, expansion2]
  });
  deepFreeze(grammar);
  deepFreeze(expansion1);
  deepFreeze(expansion2);
  expect(
    grammar.expandTerm('root')
  ).toEqual(new IncompleteChoiceElement([expansion1, expansion2]))
}
testExpandTermForMultipleExpansions();

console.log('grammar tests pass');
