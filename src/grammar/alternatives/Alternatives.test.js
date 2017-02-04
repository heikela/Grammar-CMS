// @flow
import Alternatives from './Alternatives';
import MultipleChoice from './MultipleChoice';
import Grammar from '../Grammar';

describe('Alternatives expansion type', () => {
  it('Can be added used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Alternatives.expansionType);
    grammar.setExpansion('root', Alternatives.typeTag, [
      'boolTerm',
      'stringTerm',
    ]);
    expect(grammar.createDocument('root')).toEqual(new MultipleChoice([
      'boolTerm',
      'stringTerm',
    ]));
  });
});
