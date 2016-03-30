export class SequenceExpansion {
  constructor(termSequence) {
    this.termSequence = termSequence;
  }

  expand(grammar) {
    /* Design choice to revisit: here we have a choice
       whether we want to create sequences out of expansions with
       just one term on the right hand side: A = B.
    */
    var result = {
      type: 'SEQUENCE',
      keys: this.termSequence
    }
    for (let key of this.termSequence) {
      result[key] = grammar.expandTerm(key)
    }
    return result;
  }
}

export class RepeatExpansion {
  constructor(termToRepeat) {
    this.termToRepeat = termToRepeat;
  }

  expand(grammar) {
    return {
      type: 'REPETITION',
      value: []
    }
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
      return {
        type: 'STRING',
        value: ''
      }
    } else if (applicableRules.length == 1) {
      const expansion = applicableRules[0];
      return expansion.expand(this);
    } else {
      return {
        type: 'INCOMPLETE_CHOICE',
        alternativeExpansions: applicableRules
      }
    }
  }

  initDocument() {
    return this.expandTerm('root');
  }
}

const createElement = () => {
  return {
    type: 'UNKNOWN'
  }
}

export const addToRepetition = (document, path) => {
  if (path.length === 0) {
    if (document.type === 'REPETITION') {
      return {
        ...document,
        value: [
          ...document.value,
          createElement()
        ]
      }
    } else {
      throw ('addToRepetition called for a non-sequence path');
    }
  } else {
    const currentKey = path[0];
    let affectedTree = {};
    affectedTree[currentKey] = addToRepetition(document[currentKey], path.slice(1));
    return {
      ...document,
      ...affectedTree
    }
  }
}

// Tests
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testaddToRepetition = () => {
  const documentBefore = {
    type: 'SEQUENCE',
    title: {
        type: 'STRING',
        value: '',
    },
    questions: {
      type: 'REPETITION',
      value: []
    }
  };
  const documentAfter = {
    type: 'SEQUENCE',
    title: {
        type: 'STRING',
        value: '',
    },
    questions: {
      type: 'REPETITION',
      value: [
        {
          type: 'UNKNOWN'
        }
      ]
    }
  };
  deepFreeze(documentBefore);
  expect(
    addToRepetition(documentBefore, ['questions'])
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
    {
      type: 'SEQUENCE',
      keys: ['A', 'B'],
      A: {
        type: 'STRING',
        value: '',
      },
      B: {
        type: 'STRING',
        value: ''
      }
    }
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
    {
      type: 'REPETITION',
      value: []
    }
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
  ).toEqual(
    {
      type: 'INCOMPLETE_CHOICE',
      alternativeExpansions: [expansion1, expansion2]
    }
  )
}
testExpandTermForMultipleExpansions();

console.log('grammar tests pass');
