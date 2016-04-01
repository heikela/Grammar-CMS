import expect from 'expect';
import deepFreeze from 'deep-freeze';

import {
  RepetitionElement,
  SequenceElement,
  StringElement,
  IncompleteChoiceElement,
  addToRepetition,
  updateString,

} from './document';

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

import { Grammar } from './grammar';

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
testUpdateStringElement();

console.log('document tests pass');
export var documentTestResult = true;
