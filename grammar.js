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

export class AlternativesExpansion {
  constructor(alternativeTerms) {
    this.alternativeTerms = alternativeTerms;
  }

  expand(grammar) {
    return new IncompleteChoiceElement(this.alternativeTerms);
  }
}

export class Grammar {
  constructor(rules) {
    this.rules = rules
  }

  expandTerm(term) {
    const applicableRule = this.rules[term];
    if (applicableRule === undefined) {
      // For now, assume that a term without an expansion is a string terminal
      return new StringElement();
    } else {
      return applicableRule.expand(this);
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
    root: new SequenceExpansion(['A', 'B'])
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
    root: new RepeatExpansion('A')
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

const testExpandTermForAlternativesExpansion = () => {
  const alternative1 = new RepeatExpansion('A');
  const alternative2 = new SequenceExpansion(['A', 'B']);
  const grammar = new Grammar({
    root: new AlternativesExpansion(["alt1", "alt2"]),
    alt1: alternative1,
    alt2: alternative2
  });
  deepFreeze(grammar);
  deepFreeze(alternative1);
  deepFreeze(alternative2);
  console.log(grammar);
  expect(
    grammar.expandTerm('root')
  ).toEqual(new IncompleteChoiceElement(["alt1", "alt2"]))
}
testExpandTermForAlternativesExpansion();

console.log('grammar tests pass');
