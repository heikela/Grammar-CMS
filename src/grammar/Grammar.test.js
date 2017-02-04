// @flow

import Grammar from './Grammar';

describe('grammar', () => {
  it('does not accept an expansion type without an expansion type tag', () => {
    const grammar = new Grammar();
    // $FlowFixMe
    expect(() => grammar.registerExpansionType({
      initialiser: () => true,
    })).toThrowError(/typeTag/);
  });

  it(
    'does not allow adding an expansion type with an expansion typeTag that has already been taken',
    () => {
      const grammar = new Grammar();
      const expansionType = {
        typeTag: 'booleanField',
        initialiser: () => false,
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
    expect(
      () => grammar.setExpansion('root', 'unknownExpansionType', []),
    ).toThrowError(/not found.*ype/);
  });

  it('does not allow adding two expansions for the same term', () => {
    const grammar = new Grammar();
    const booleanField = {
      typeTag: 'booleanField',
      initialiser: () => false,
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
      initialiser: () => true,
    };
    grammar.registerExpansionType(booleanField);
    grammar.setExpansion('root', 'booleanField', []);
    const document = grammar.createDocument('root');
    expect(document).toBe(true);
  });
});
