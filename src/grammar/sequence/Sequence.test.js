// @flow
import { Map } from 'immutable';

import Sequence from './Sequence';
import Constant from '../constant/Constant';
import Grammar from '../Grammar';
import type { elementAndId } from '../Grammar';

describe('Sequence expansion type', () => {
  it('can be used in a grammar', () => {
    let grammar = new Grammar();
    grammar.registerExpansionType(Sequence.expansionType);
    grammar.registerExpansionType(Constant.expansionType);
    grammar.setExpansion('root', Sequence.typeTag, ['name', 'email']);
    grammar.setExpansion('name', Constant.typeTag, 'Jane Doe');
    grammar.setExpansion('email', Constant.typeTag, 'someone@example.com');

    const elements = grammar.createElements('root', 'someId');
    const rootElement = elements.find(
      ({ elementId }) => elementId === 'someId',
    );
    expect(rootElement).toBeTruthy();
    if (rootElement) {
      const nameElementId = rootElement.element.data.childElementIds.get(
        'name',
      );
      const emailElementId = rootElement.element.data.childElementIds.get(
        'email',
      );
      expect(rootElement).toEqual({
        elementId: 'someId',
        element: {
          typeTag: 'SEQUENCE',
          data: {
            fields: ['name', 'email'],
            childElementIds: Map({
              name: nameElementId,
              email: emailElementId,
            }),
          },
        },
      });
      expect(elements).toContainEqual({
        elementId: nameElementId,
        element: {
          typeTag: 'CONSTANT',
          data: 'Jane Doe',
        },
      });
      expect(elements).toContainEqual({
        elementId: emailElementId,
        element: {
          typeTag: 'CONSTANT',
          data: 'someone@example.com',
        },
      });
    }
  });
});
