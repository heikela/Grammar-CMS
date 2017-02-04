// @flow

import { Map } from 'immutable';
import Repository from '../repository/Repository';

interface ExpansionType {
  typeTag: string,
  initialiser(x: any): mixed,
}

const expansion = (initialiser, expansionParams) => ({
  initialiser: initialiser,
  expansionParams: expansionParams,
});

class Grammar {
  expansionTypes: Repository<ExpansionType>;
  expansions: Map<string, *>;

  constructor() {
    this.expansionTypes = new Repository();
    this.expansions = Map();
  }

  registerExpansionType(expansionType: ExpansionType) {
    if (typeof expansionType.initialiser !== 'function') {
      throw new Error('expansionType must have an initialiser function');
    }
    this.expansionTypes.registerType(expansionType);
  }

  setExpansion(term: string, expansionTypeTag: string, expansionParams: *) {
    const expansionType = this.expansionTypes.get(expansionTypeTag);
    if (!expansionType) {
      throw new Error(
        'cannot add an expansion using the unknown expansion type: ',
        +expansionTypeTag,
      );
    }
    if (this.expansions.has(term)) {
      throw new Error(
        'cannot add multiple expansions for the same term: ' + term,
      );
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
