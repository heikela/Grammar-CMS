// @flow

import Repository from './Repository';

describe('repository', () => {
  it('does not accept an entry without a type tag', () => {
    const repository = new Repository();
    // $FlowFixMe
    expect(() => repository.registerType({})).toThrowError(/typeTag/);
  });

  it(
    'does not allow adding an entry with a typeTag that has already been taken',
    () => {
      const repository = new Repository();
      const entry = {
        typeTag: 'booleanField',
      };
      repository.registerType(entry);
      expect(() => repository.registerType(entry)).toThrowError(/typeTag/);
    },
  );

  it('allows finding entries by typeTag', () => {
    const repository = new Repository();
    const entry = {
      typeTag: 'foo',
      content: 'bar',
    };
    const entry2 = {
      typeTag: 'bar',
      content: 'bar2',
    };
    repository.registerType(entry);
    repository.registerType(entry2);
    expect(repository.get('bar').content).toEqual('bar2');
    expect(repository.get('foo').content).toEqual('bar');
  });

  it('throws when looking for a missing entry', () => {
    const repository = new Repository();
    expect(() => repository.get('bar')).toThrowError(/not found/);
  });
});
