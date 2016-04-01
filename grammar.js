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

// Tests
import expect from 'expect';
import deepFreeze from 'deep-freeze';

import {
  SequenceElement,
  RepetitionElement,
  StringElement,
  IncompleteChoiceElement
} from './document';

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
