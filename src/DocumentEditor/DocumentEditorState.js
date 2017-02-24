// @flow
import { Map } from 'immutable';

import type { documentElement } from '../grammar/Grammar';

export const ROOT_ELEMENT_ID = 'root';

export type documentEditorState = {
  elements: Map<string, Map<string, documentElement>>,
};

export const getElement = (
  state: documentEditorState,
  documentId: string,
  elementId: string,
): ?documentElement =>
  state.elements.getIn([documentId, elementId]);

export type updateAction = {
  type: 'UPDATE_ELEMENT',
  payload: {
    documentId: string,
    elementId: string,
    newData: mixed,
  },
};

export const updateElement = (
  documentId: string,
  elementId: string,
  newData: mixed,
): updateAction => {
  return {
    type: 'UPDATE_ELEMENT',
    payload: {
      documentId,
      elementId,
      newData,
    },
  };
};

export type createElementAction = {
  type: 'CREATE_ELEMENT',
  payload: {
    documentId: string,
    elementId: string,
    element: documentElement,
  },
};

export const createElement = (
  documentId: string,
  elementId: string,
  element: documentElement,
): createElementAction => {
  return {
    type: 'CREATE_ELEMENT',
    payload: {
      documentId,
      elementId,
      element,
    },
  };
};

export type createDocumentAction = {
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

type action = updateAction | createElementAction | createDocumentAction;

const reducer = (
  oldState: documentEditorState = { elements: new Map() },
  action: action,
): documentEditorState => {
  switch (action.type) {
    case 'UPDATE_ELEMENT':
      const update: updateAction = action;
      return {
        elements: oldState.elements.updateIn(
          [action.payload.documentId, action.payload.elementId],
          element => ({ ...element, data: update.payload.newData }),
        ),
      };

    case 'CREATE_ELEMENT':
      const createElement: createElementAction = action;
      return {
        elements: oldState.elements.setIn(
          [action.payload.documentId, action.payload.elementId],
          createElement.payload.element,
        ),
      };

    case 'CREATE_DOCUMENT':
      const state = {
        elements: oldState.elements.set(
          action.payload.documentId,
          new Map().set(ROOT_ELEMENT_ID, action.payload.rootElement),
        ),
      };
      return state;

    default:
      return oldState;
  }
};

export default reducer;
