import { randomId } from './util';

import {
  RepetitionElement,
  SequenceElement,
  StringElement
} from './document';

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
  } else {
    return new StringElement(document.value);
  }
  return null;
}
