// @flow
import Constant from './Constant';
import Grammar from '../Grammar';

describe('Constant expansion type', () => {
  it('can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Constant.expansionType);
    grammar.setExpansion('root', Constant.typeTag, { field: 'value' });
    expect(grammar.createDocument('root')).toEqual({ field: 'value' });
  });
});
