// @flow
import Constant from './Constant';
import Grammar from '../Grammar';

describe('Constant expansion type', () => {
  it('can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Constant.expansionType);
    grammar.setExpansion('root', Constant.typeTag, { field: 'value' });
    expect(grammar.createElements('root', 'someId')).toEqual([
      {
        elementId: 'someId',
        element: {
          typeTag: 'CONSTANT',
          data: { field: 'value' },
        },
      },
    ]);
  });
});
