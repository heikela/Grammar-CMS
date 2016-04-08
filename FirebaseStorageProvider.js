import { randomId } from './util';

import {
  RepetitionElement,
  SequenceElement,
  StringElement,
  IncompleteChoiceElement
} from './document';

import {
  ImageElement
} from './CloudinaryImage';

export class FirebaseStorageProvider {
  constructor(collectionRef) {
    this.collectionRef = collectionRef;
    this.fireBaseRef = new Firebase(this.collectionRef);
  }

  save(document) {
    var saved = false;
    var attemptsRemaining = 4;
    const tryToSave = () => {
      const potentialId = randomId();
      const ref = this.fireBaseRef.child(potentialId);
      ref.transaction(
        (existingData) => {
          if (existingData === null) {
            saved
            return {
              json: document.objectForJson(),
              complete: document
            };
          } else {
            console.log('Randomly generated ID was not free.');
            return; // Abort the transaction.
          }
        },
        (error, committed, snapshot) => {
          if (error || !committed) {
            if (error) {
              console.log('Firebase transaction failed abnormally!', error);
            } else if (!committed) {
              console.log('Randomly generated ID was not free');
            }
            if (attemptsRemaining > 0) {
              console.log('trying again');
              attemptsRemaining = attemptsRemaining - 1;
              tryToSave();
            } else {
              console.log('gave up trying to save the documet');
            }
          } else {
            console.log('Document Saved');
          }
        }
      );
    }
    tryToSave();
  }

  list(callback) {
    this.fireBaseRef.once(
      'value',
      (dataSnapshot) => {
        var listing = [];
        dataSnapshot.forEach((documentSnapshot) => {
          const key = documentSnapshot.key();
          const title = documentSnapshot.child('json').child('title').val();
          listing.push({
            key: key,
            title: title
          });
        });
        callback(listing);
      },
      (error) => {
        throw error;
      }
    )
  }

  load(reference, callback) {
    this.fireBaseRef.child(reference).child('complete').once(
      'value',
      (dataSnapshot) => {
        callback(documentFromDump(dataSnapshot.val()));
      },
      (error) => {
        throw error;
      }
    )
  }
}

const documentFromDump = (document) => {
  if (document.keys !== undefined) {
    var elements = {};
    for (const key of document.keys) {
      elements[key] = documentFromDump(document.elements[key]);
    }
    return new SequenceElement(
      document.keys,
      elements
    );
  } else if (document.typeToRepeat !== undefined) {
    const elements = document.elements.map((e) => documentFromDump(e));
    return new RepetitionElement(document.typeToRepeat, elements);
  } else if (document.url !== undefined) {
    return new ImageElement(document.url, document.width, document.height);
  } else if (document.alternateExpansions !== undefined) {
    return new IncompleteChoiceElement(document.alternateExpansions);
  } else {
    return new StringElement(document.value);
  }
  return null;
}

// TESTS

import expect from 'expect';
import deepFreeze from 'deep-freeze';
import { SequenceExpansion } from './grammar';

const testThatElementGetsRecoveredFromDump = (element) => {
  deepFreeze(element);
  expect (
    documentFromDump(element)
  ).toEqual(element);
}

const testReadStringElement = () => {
  const element = new StringElement('StringValue');
  testThatElementGetsRecoveredFromDump(element);
}
testReadStringElement();

const testReadSequenceElement = () => {
  const element = new SequenceElement(
    ['a', 'b'],
    {
      a: new StringElement('foo'),
      b: new StringElement('bar')
    }
  );
  testThatElementGetsRecoveredFromDump(element);
}
testReadSequenceElement();

const testReadRepetitionElement = () => {
  const element = new RepetitionElement(
    'type',
    [new StringElement('foo'), new StringElement('bar')]
  );
  testThatElementGetsRecoveredFromDump(element);
}

const testReadImageElement = () => {
  const element = new ImageElement('http://image.com/url', 1920, 1080);
  testThatElementGetsRecoveredFromDump(element);
}
testReadImageElement();

const testReadIncompleteChoiceElement = () => {
  const element = new IncompleteChoiceElement(
    [
      new SequenceExpansion(['expansion1']),
      new SequenceExpansion(['expansion2a', 'expansion2b'])
    ]
  );
  testThatElementGetsRecoveredFromDump(element);
}
testReadIncompleteChoiceElement();

console.log('FirebaseStorageProvider tests pass');
