// @flow
import { Map } from 'immutable';

interface Entry {
  typeTag: string,
}

class Repository<A> {
  entries: Map<string, A>;

  constructor() {
    this.entries = Map();
  }

  registerType(entry: Entry & A) {
    const typeTag = entry.typeTag;
    if (typeof typeTag !== 'string') {
      throw new Error('entry must have a typeTag of type string');
    }
    if (this.entries.has(typeTag)) {
      throw new Error(
        'entry must have a unique typeTag. ' + typeTag + ' is taken.',
      );
    }
    this.entries = this.entries.set(typeTag, entry);
  }

  get(type: string): A {
    if (this.entries.has(type)) {
      return this.entries.get(type);
    } else {
      throw new Error('entry not found for type tag ' + type);
    }
  }
}

export default Repository;
