import { randomId } from './util';

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

export class FirebaseStorageProvider {
  constructor(collectionRef, authCallback) {
    this.collectionRef = collectionRef;
    this.fireBaseRef = new Firebase(this.collectionRef);
    this.authClient = new FirebaseSimpleLogin(this.fireBaseRef, authCallback);
  }

  logout() {
    this.authClient.logout();
  }

  login(username, password) {
    this.authClient.login('password', {
      email: username,
      password: password
    });
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
        callback(null,listing);
      },
      (error) => {
        callback(error, null);
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
    const elements = (document.elements !== undefined) ? document.elements.map((e) => documentFromDump(e)) : [];
    return new RepetitionElement(document.typeToRepeat, elements);
  } else if (document.url !== undefined) {
    return new ImageElement(document.url, document.width, document.height);
  } else if (document.alternateExpansions !== undefined) {
    return new IncompleteChoiceElement(document.alternateExpansions);
  } else if (document.type === 'MULTILINE_TEXT') {
    return new MultiLineTextElement(document.value);
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
    documentFromDump(JSON.parse(JSON.stringify(element)))
  ).toEqual(element);
}

const testReadStringElement = () => {
  const element = new StringElement('StringValue');
  testThatElementGetsRecoveredFromDump(element);
}
testReadStringElement();

const testReadMultiLineTextElement = () => {
  const element = new MultiLineTextElement("some\
text\
spanning\
lines");
  testThatElementGetsRecoveredFromDump(element);
}
testReadMultiLineTextElement();

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
testReadRepetitionElement();

const testReadEmptyRepetitionElement = () => {
  const element = new RepetitionElement(
    'type',
    []
  );
  testThatElementGetsRecoveredFromDump(element);
}
testReadEmptyRepetitionElement();

const testReadImageElement = () => {
  const element = new ImageElement('http://image.com/url', 1920, 1080);
  testThatElementGetsRecoveredFromDump(element);
}
testReadImageElement();

const testReadIncompleteChoiceElement = () => {
  const element = new IncompleteChoiceElement(
    ['expansion1', 'expansion2']
  );
  testThatElementGetsRecoveredFromDump(element);
}
testReadIncompleteChoiceElement();

console.log('FirebaseStorageProvider tests pass');
