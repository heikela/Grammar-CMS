// @flow
import { Map } from 'immutable';

import type { documentElement } from '../grammar/Grammar';

type state = {
  elements: Map<string, Map<string, documentElement>>,
};

type updateAction = {
  type: 'UPDATE_ELEMENT',
  payload: {
    documentId: string,
    elementId: string,
    value: documentElement,
  },
};

type createDocumentAction = {
  type: 'CREATE_DOCUMENT',
  payload: {
    documentId: string,
    rootElement: documentElement,
  },
};

export const createDocument = (
  documentId: string,
  root: documentElement,
): createDocumentAction => ({
  type: 'CREATE_DOCUMENT',
  payload: {
    documentId: documentId,
    rootElement: root,
  },
});

type action = updateAction | createDocumentAction;

const reducer = (oldState: state = { elements: new Map() }, action: action) => {
  switch (action.type) {
    case 'UPDATE_ELEMENT':
      return {
        elements: oldState.elements.setIn(
          [action.payload.documentId, action.payload.elementId],
          action.payload.value,
        ),
      };

    case 'CREATE_DOCUMENT':
      const state = {
        elements: oldState.elements.set(
          action.payload.documentId,
          new Map().set('root', action.payload.rootElement),
        ),
      };
      return state;

    default:
      return oldState;
  }
};

export default reducer;
