import { randomId } from './util';
import { serialize, deSerialize } from './documentSerialization';

export class FirebaseStorageProvider {
  constructor(collectionRef) {
    this.collectionRef = collectionRef;
    this.fireBaseRef = new Firebase(this.collectionRef);
  }

  initAuthClient(authCallback) {
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

  save(document, callback) {
    var attemptsRemaining = 4;
    const tryToSave = () => {
      const potentialId = randomId();
      const ref = this.fireBaseRef.child(potentialId);
      ref.transaction(
        (existingData) => {
          if (existingData === null) {
            return {
              json: document.objectForJson(),
              complete: serialize(document)
            };
          } else {
            /* eslint-disable no-console */
            console.log('Randomly generated ID was not free.');
            return null; // Abort the transaction.
          }
        },
        (error, committed/*, snapshot*/) => {
          if (error || !committed) {
            if (error) {
              console.log('Firebase transaction failed abnormally!', error);
            } else if (!committed) {
              console.log('Randomly generated ID was not free');
            }
            if (attemptsRemaining > 0) {
              console.log('trying again');
              /* eslint-enable no-console */
              attemptsRemaining = attemptsRemaining - 1;
              tryToSave();
            } else {
              callback('gave up trying to save the documet', null);
            }
          } else {
            callback(null, 'Document Saved');
          }
        }
      );
    };
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
        callback(null, listing);
      },
      (error) => {
        callback(error, null);
      }
    );
  }

  load(reference, callback) {
    this.fireBaseRef.child(reference).child('complete').once(
      'value',
      (dataSnapshot) => {
        callback(null, deSerialize(dataSnapshot.val()));
      },
      (error) => {
        callback(error, null);
      }
    );
  }
}
