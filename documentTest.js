import expect from 'expect';
import deepFreeze from 'deep-freeze';
import {testCase} from './trivialRunner';

import {
  RepetitionElement,
  SequenceElement,
  StringElement,
  addToRepetition,
  updateString,
  removeFromRepetition
} from './document';

testCase('testUpdatedAtForElementInRepetition', () => {
    const documentBefore = new RepetitionElement(
      'A',
      [
        new StringElement('foo'),
        new StringElement('bar'),
        new StringElement('baz')
      ]
    );
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
);

testCase('testUpdatedAtForElementInSequence', () => {
    const documentBefore = new SequenceElement(
      ['A', 'B'],
      {
        A: new StringElement('foo'),
        B: new StringElement('bar')
      }
    );
    const path = ['B'];
    const documentAfter = new SequenceElement(
      ['A', 'B'],
      {
        A: new StringElement('foo'),
        B: new StringElement('bar2')
      }
    );
    deepFreeze(documentBefore);
    deepFreeze(path);
    expect(
      documentBefore.updatedAt(path, (element) => new StringElement(element.value + '2'))
    ).toEqual(documentAfter);
  }
);

import { Grammar } from './grammar';

testCase('testaddToRepetition', () => {
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
);

testCase('testRemoveFromRepetition', () => {
    const documentBefore =
      new SequenceElement(
        ['title', 'questions'],
        {
          title: new StringElement(),
          questions:
            new RepetitionElement(
              'question',
              [
                new StringElement('zero'),
                new StringElement('one'),
                new StringElement('two')
              ]
            )
        }
      );
    const documentAfter =
      new SequenceElement(
        ['title', 'questions'],
        {
          title: new StringElement(),
          questions:
            new RepetitionElement(
              'question',
              [
                new StringElement('zero'),
                new StringElement('two')
              ]
            )
        }
      );
    deepFreeze(documentBefore);

    expect(
      removeFromRepetition(documentBefore, ['questions', 1])
    ).toEqual(documentAfter);
  }
);

testCase('testUpdateStringElement', () => {
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
    );
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
    );
    deepFreeze(documentBefore);
    expect(
      updateString(documentBefore, ['Bs', 1], 'fooBar')
    ).toEqual(documentAfter);
  }
);
