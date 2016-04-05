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
        console.log(listing);
        callback(listing);
      },
      (error) => {
        throw error;
      }
    )
  }

  load(reference, callback) {
    throw 'not implemented';
  }
}
