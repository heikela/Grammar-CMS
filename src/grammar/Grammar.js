// @flow

import { Map } from 'immutable';
import Repository from '../repository/Repository';

export interface documentElement {
  typeTag: string,
  data: mixed,
}

export interface ExpansionType {
  typeTag: string,
  initialiser(x: any): mixed,
}

export interface Expansion {
  typeTag: string,
  initialiser(x: any): mixed,
  expansionParams: mixed,
}

const expansion = (expansionType, expansionParams): Expansion => ({
  typeTag: expansionType.typeTag,
  initialiser: expansionType.initialiser,
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
      expansion(expansionType, expansionParams),
    );
  }

  createDocument(root: string): documentElement {
    const expansion = this.expansions.get(root);
    return {
      typeTag: expansion.typeTag,
      data: expansion.initialiser(expansion.expansionParams),
    };
  }
}

export default Grammar;
