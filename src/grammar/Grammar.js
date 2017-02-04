// @flow

import { Map } from 'immutable';

type ExpansionType = {
  expansionTypeTag: string,
  initialiser(x: any): mixed,
};

const expansion = (initialiser, expansionParams) => ({
  initialiser: initialiser,
  expansionParams: expansionParams,
});

class Grammar {
  expansionTypes: Map<string, *>;
  expansions: Map<string, *>;

  constructor() {
    this.expansionTypes = Map();
    this.expansions = Map();
  }

  registerExpansionType(expansionType: ExpansionType) {
    const typeTag = expansionType.expansionTypeTag;
    if (typeof typeTag !== 'string') {
      throw 'expansionType must have an expansionTypeTag of type string';
    }
    if (this.expansionTypes.has(typeTag)) {
      throw 'expansionType must have an unique expansionTypeTag. ' +
        typeTag +
        ' is taken.';
    }
    if (typeof expansionType.initialiser !== 'function') {
      throw 'expansionType must have an initialiser function';
    }
    this.expansionTypes = this.expansionTypes.set(typeTag, expansionType);
  }

  setExpansion(term: string, expansionTypeTag: string, expansionParams: *) {
    const expansionType = this.expansionTypes.get(expansionTypeTag);
    if (!expansionType) {
      throw 'cannot add an expansion using the unknown expansion type: ' +
        expansionTypeTag;
    }
    if (this.expansions.has(term)) {
      throw 'cannot add multiple expansions for the same term: ' + term;
    }
    this.expansions = this.expansions.set(
      term,
      expansion(expansionType.initialiser, expansionParams),
    );
  }

  createDocument(root: string) {
    const expansion = this.expansions.get(root);
    return expansion.initialiser(expansion.expansionParams);
  }
}

export default Grammar;
