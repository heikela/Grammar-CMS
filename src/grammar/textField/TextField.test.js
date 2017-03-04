// @flow
import TextField from './TextField';
import Grammar from '../Grammar';

describe('TextField expansion type', () => {
  it('Can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(TextField.expansionType);
    grammar.setExpansion('root', TextField.typeTag);
    expect(grammar.createElements('root', 'someId')).toEqual([
      {
        elementId: 'someId',
        element: {
          typeTag: 'TEXT_FIELD',
          data: {
            value: '',
          },
        },
      },
    ]);
  });
});
