import { randomId } from './util';
import { serialize, deSerialize } from './documentSerialization';

export class LocalStorageStorageProvider {
  constructor(collectionRef) {
    this.collectionRef = collectionRef;
    this.localStorage = window.localStorage;
  }

  keyForId(id) {
    return this.collectionRef + '/' + id;
  }

  save(document, callback) {
    var attemptsRemaining = 4;
    const tryToSave = () => {
      const potentialId = randomId();
      const storageKey = this.keyForId(potentialId);
      const existingData = this.localStorage.getItem(storageKey);
      var error = null;
      if (existingData === null) {
        try {
          this.localStorage.setItem(
            storageKey,
            JSON.stringify(
              {
                json: document.objectForJson(),
                complete: serialize(document)
              }
            )
          );
        } catch (e) {
          error = e;
        }
      } else {
        /* eslint-disable no-console */
        console.log('Randomly generated ID was not free.');
        error = 'Randomly generated ID was not free.';
      }
      if (error) {
        console.log('Firebase transaction failed abnormally!', error);
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
    };
    tryToSave();
  }

  list(callback) {
    const itemCount = this.localStorage.length;
    var listing = [];
    for (var i = 0; i < itemCount; ++i) {
      const key = this.localStorage.key(i);
      const prefix = this.collectionRef;
      const prefixLength = prefix.length;
      if (key.substr(0, prefixLength) === prefix) {
        const id = key.substr(prefixLength + 1);
        this.load(id, (error, document) => {
          if (!error) {
            try {
              listing.push({
                key: id,
                title: document.elements.title.value
              });
            } catch (e) {
              /* eslint-disable no-console */
              console.log('unable to list document with key: ' + id);
              /* eslint-disable no-console */
            }
          }
        });
      }
    }
    callback(null, listing);
  }

  load(reference, callback) {
    const storageKey = this.keyForId(reference);
    const data = this.localStorage.getItem(storageKey);
    if (data) {
      callback(null, deSerialize(JSON.parse(data).complete));
    } else {
      callback('document not found', null);
    }
  }
}
