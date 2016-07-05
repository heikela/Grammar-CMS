import {
  serialize,
  deSerialize
} from './documentSerialization';

import {
  RepetitionElement,
  SequenceElement,
  StringElement,
  MultiLineTextElement,
  IncompleteChoiceElement
} from './document';

import {
  ImageElement
} from './CloudinaryImage';

import { testCase } from './trivialRunner';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testThatElementGetsRecoveredFromSerialization = (element) => {
  deepFreeze(element);
  expect(
    deSerialize(JSON.parse(JSON.stringify(serialize(element))))
  ).toEqual(element);
};

testCase('testReadStringElement', () => {
    const element = new StringElement('StringValue');
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadMultiLineTextElement', () => {
    /* eslint-disable quotes,no-multi-str */
    const element = new MultiLineTextElement("some\
text\
spanning\
lines");
  /* eslint-enable quotes,no-multi-str */
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadSequenceElement', () => {
    const element = new SequenceElement(
      ['a', 'b'],
      {
        a: new StringElement('foo'),
        b: new StringElement('bar')
      }
    );
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadRepetitionElement', () => {
    const element = new RepetitionElement(
      'type',
      [new StringElement('foo'), new StringElement('bar')]
    );
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadEmptyRepetitionElement', () => {
    const element = new RepetitionElement(
      'type',
      []
    );
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadImageElement', () => {
    const element = new ImageElement('http://image.com/url', 1920, 1080);
    testThatElementGetsRecoveredFromSerialization(element);
  }
);

testCase('testReadIncompleteChoiceElement', () => {
    const element = new IncompleteChoiceElement(
      ['expansion1', 'expansion2']
    );
    testThatElementGetsRecoveredFromSerialization(element);
  }
);
