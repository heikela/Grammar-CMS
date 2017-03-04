// @flow

import Grammar, { idForElement, makeElement } from './Grammar';

const dummyInitialiser = (id: string) => [
  idForElement(id, makeElement('SOME_TYPE', {})),
];

describe('grammar', () => {
  it('does not accept an expansion type without an expansion type tag', () => {
    const grammar = new Grammar();
    // $FlowFixMe
    expect(() => grammar.registerExpansionType({
      initialiser: dummyInitialiser,
    })).toThrowError(/typeTag/);
  });

  it(
    'does not allow adding an expansion type with an expansion typeTag that has already been taken',
    () => {
      const grammar = new Grammar();
      const expansionType = {
        typeTag: 'booleanField',
        initialiser: dummyInitialiser,
      };
      grammar.registerExpansionType(expansionType);
      expect(() => grammar.registerExpansionType(expansionType)).toThrowError(
        /typeTag/,
      );
    },
  );

  it('does not allow adding an expansion type without an initialiser', () => {
    const grammar = new Grammar();
    const expansionType = {
      typeTag: 'booleanField',
    };
    // $FlowFixMe
    expect(() => grammar.registerExpansionType(expansionType)).toThrowError(
      /initialiser/,
    );
  });

  it('does not allow adding expansions with unknown expansion types', () => {
    const grammar = new Grammar();
    expect(() =>
      grammar.setExpansion('root', 'unknownExpansionType', [])).toThrowError(
      /not found.*ype/,
    );
  });

  it('does not allow adding two expansions for the same term', () => {
    const grammar = new Grammar();
    const booleanField = {
      typeTag: 'booleanField',
      initialiser: dummyInitialiser,
    };
    grammar.registerExpansionType(booleanField);
    grammar.setExpansion('root', 'booleanField', []);
    expect(() => grammar.setExpansion('root', 'booleanField', [])).toThrowError(
      /multiple.*expansion/,
    );
  });

  it('allows creating a document based on a grammar', () => {
    const grammar = new Grammar();
    const booleanField = {
      typeTag: 'booleanField',
      initialiser: id => [idForElement(id, makeElement('booleanField', false))],
    };
    grammar.registerExpansionType(booleanField);
    grammar.setExpansion('root', 'booleanField', []);
    const elements = grammar.createElements('root', 'someId');
    expect(elements).toEqual([
      {
        element: {
          typeTag: 'booleanField',
          data: false,
        },
        elementId: 'someId',
      },
    ]);
  });
});
