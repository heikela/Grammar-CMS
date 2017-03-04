// @flow
import Alternatives from './Alternatives';
import MultipleChoice from './MultipleChoice';
import Grammar from '../Grammar';

describe('Alternatives expansion type', () => {
  it('Can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Alternatives.expansionType);
    grammar.setExpansion('root', Alternatives.typeTag, [
      'boolTerm',
      'stringTerm',
    ]);
    expect(grammar.createElements('root', 'someId')).toEqual([
      {
        elementId: 'someId',
        element: {
          typeTag: 'ALTERNATIVES',
          data: new MultipleChoice(['boolTerm', 'stringTerm']),
        },
      },
    ]);
  });
});
