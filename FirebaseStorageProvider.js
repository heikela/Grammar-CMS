import { randomId } from './util';

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

  list() {
    throw 'not implemented';
  }

  load(reference) {
    throw 'not implemented';
  }
}
