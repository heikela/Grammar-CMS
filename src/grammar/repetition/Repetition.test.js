// @flow
import { List } from 'immutable';

import Repetition from './Repetition';
import Constant from '../constant/Constant';
import Grammar from '../Grammar';
import type { elementAndId } from '../Grammar';

describe('Repetition type', () => {
  it('can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Repetition.expansionType);
    grammar.registerExpansionType(Constant.expansionType);
    grammar.setExpansion('root', Repetition.typeTag, 'contact');
    grammar.setExpansion('contact', Constant.typeTag, 'someone@example.com');

    const elements = grammar.createElements('root', 'someId');
    const rootElement = elements.find(
      ({ elementId }) => elementId === 'someId',
    );
    expect(rootElement).toBeTruthy();
    if (rootElement) {
      expect(rootElement).toEqual({
        elementId: 'someId',
        element: {
          typeTag: 'REPETITION',
          data: {
            termToRepeat: 'contact',
            childElementIds: List([]),
          },
        },
      });
    }
  });
});
