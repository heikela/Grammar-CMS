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
class Element {
  updatedAt(path, updateFn) {
    if (path.length !== 0) {
      throw "A basic element does not have sub-elements to update"
    } else {
      return updateFn(this); // This means that it's the responsibility of the update function to maintain the same element type.
    }
  }
}

class CompositeElement extends Element {
  updatedAt(path, updateFn) {
    if (path.length === 0) {
      return updateFn(this);
    } else {
      const currentKey = path[0];
      return this.updateElement(currentKey, this.elements[currentKey].updatedAt(path.slice(1), updateFn));
    }
  }
}

export class SequenceElement extends CompositeElement {
  constructor(keys, elements) {
    super();
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

  objectForJson() {
    var result = {};
    for (const key of this.keys) {
      result[key] = this.elements[key].objectForJson();
    }
    return result;
  }
}

export class RepetitionElement extends CompositeElement {
  constructor(typeToRepeat, elements = []) {
    super();
    this.typeToRepeat = typeToRepeat;
    this.elements = elements;
  }

  updateElement(key, updated) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.elements.slice(0, key),
        updated,
        ...this.elements.slice(key + 1)
      ]
    )
  }

  addNewElement(grammar) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.elements,
        grammar.expandTerm(this.typeToRepeat)
      ]
    );
  }

  get type() {
    return 'REPETITION';
  }

  objectForJson() {
    return this.elements.map((e) => e.objectForJson());
  }

}

export class StringElement extends Element {
  constructor(value = '') {
    super();
    this.value = value;
  }

  get type() {
    return 'STRING';
  }

  updated(updatedValue) {
    return new StringElement(updatedValue);
  }

  objectForJson() {
    return this.value;
  }
}

export class IncompleteChoiceElement extends Element {
  constructor(alternateExpansions) {
    super();
    this.alternateExpansions = alternateExpansions;
  }

  selectExpansion(grammar, selected) {
    return grammar.expandTerm(selected);
  }

  get type() {
    return 'INCOMPLETE_CHOICE';
  }

  objectForJson() {
    return 'incomplete_choice';
  }
}

const createElement = (term) => {
  return {
    type: 'UNKNOWN'
  }
}

export const addToRepetition = (grammar, document, path) => {
  return document.updatedAt(path, (document) => {
    return document.addNewElement(grammar); // Would it be better for diagnostics to explicitly check the type?
  });
}

export const selectExpansion = (grammar, document, path, selected) => {
  return document.updatedAt(path, (document) => {
    return document.selectExpansion(grammar, selected);
  });
}

export const updateString = (document, path, updatedValue) => {
  return document.updatedAt(path, (document) => {
    return document.updated(updatedValue);
  });
}

// Tests
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testUpdatedAtForElementInRepetition = () => {
  const documentBefore = new RepetitionElement(
    'A',
    [
      new StringElement('foo'),
      new StringElement('bar'),
      new StringElement('baz')
    ]
  )
  const path = [1];
  const documentAfter = new RepetitionElement(
    'A',
    [
      new StringElement('foo'),
      new StringElement('bar2'),
      new StringElement('baz')
    ]
  );
  deepFreeze(documentBefore);
  deepFreeze(path);
  expect(
    documentBefore.updatedAt(path, (element) => new StringElement(element.value + '2'))
  ).toEqual(documentAfter);
}
testUpdatedAtForElementInRepetition();

const testUpdatedAtForElementInSequence = () => {
  const documentBefore = new SequenceElement(
    ['A','B'],
    {
      A: new StringElement('foo'),
      B: new StringElement('bar')
    }
  )
  const path = ['B'];
  const documentAfter = new SequenceElement(
    ['A','B'],
    {
      A: new StringElement('foo'),
      B: new StringElement('bar2')
    }
  )
  deepFreeze(documentBefore);
  deepFreeze(path);
  expect(
    documentBefore.updatedAt(path, (element) => new StringElement(element.value + '2'))
  ).toEqual(documentAfter);
}
testUpdatedAtForElementInSequence();

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

const testUpdateStringElement = () => {
  const documentBefore = new SequenceElement(
    ['A', 'Bs'],
    {
      A: new StringElement(),
      Bs: new RepetitionElement(
        'B',
        [
          new StringElement('bar'),
          new StringElement('foo')
        ]
      )
    }
  )
  const documentAfter = new SequenceElement(
    ['A', 'Bs'],
    {
      A: new StringElement(),
      Bs: new RepetitionElement(
        'B',
        [
          new StringElement('bar'),
          new StringElement('fooBar')
        ]
      )
    }
  )
  deepFreeze(documentBefore)
  expect(
    updateString(documentBefore, ['Bs', 1], 'fooBar')
  ).toEqual(documentAfter);
}
testUpdateStringElement()

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
