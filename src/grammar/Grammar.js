// @flow

import { Map } from 'immutable';
import Repository from '../repository/Repository';

export interface documentElement {
  typeTag: string,
  data: any,
}

export interface elementAndId {
  elementId: string,
  element: documentElement,
}

type initialiserFunction<D> = (
  rootElementId: string,
  data: D,
  grammar: ?Grammar,
) => createElementsResult;

export type createElementsResult = Array<elementAndId>;

export interface ExpansionType {
  typeTag: string,
  initialiser: initialiserFunction<any>,
}

export interface Expansion {
  typeTag: string,
  initialiser: initialiserFunction<any>,
  expansionParams: mixed,
}

const expansion = (expansionType, expansionParams): Expansion => ({
  typeTag: expansionType.typeTag,
  initialiser: expansionType.initialiser,
  expansionParams: expansionParams,
});

export const makeElement = (typeTag: string, data: mixed): documentElement => ({
  typeTag,
  data,
});

export const idForElement = (
  elementId: string,
  element: documentElement,
): elementAndId => ({
  elementId,
  element,
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

  createElements(root: string, rootElementId: string): createElementsResult {
    const expansion = this.expansions.get(root);
    return expansion.initialiser(
      rootElementId,
      expansion.expansionParams,
      this,
    );
  }
}

export default Grammar;
