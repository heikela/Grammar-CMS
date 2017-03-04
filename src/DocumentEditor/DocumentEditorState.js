// @flow
import { Map } from 'immutable';

import type { documentElement, createElementsResult } from '../grammar/Grammar';

export const ROOT_ELEMENT_ID = 'root';

type document = Map<string, documentElement>;

export type documentEditorState = {
  elements: Map<string, document>,
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

export type addElementsAction = {
  type: 'ADD_ELEMENTS',
  payload: {
    documentId: string,
    elements: createElementsResult,
  },
};

export const addElements = (
  documentId: string,
  elements: createElementsResult,
): addElementsAction => {
  return {
    type: 'ADD_ELEMENTS',
    payload: {
      documentId,
      elements,
    },
  };
};

export type createDocumentAction = {
  type: 'CREATE_DOCUMENT',
  payload: {
    documentId: string,
    elements: createElementsResult,
  },
};

export const createDocument = (
  documentId: string,
  elements: createElementsResult,
): createDocumentAction => ({
  type: 'CREATE_DOCUMENT',
  payload: {
    documentId: documentId,
    elements: elements,
  },
});

type action = updateAction | addElementsAction | createDocumentAction;

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

    case 'ADD_ELEMENTS':
      return {
        elements: oldState.elements.mergeIn(
          [action.payload.documentId],
          new Map(
            action.payload.elements.map(({ elementId, element }) => [
              elementId,
              element,
            ]),
          ),
        ),
      };

    case 'CREATE_DOCUMENT':
      const state = {
        elements: oldState.elements.set(
          action.payload.documentId,
          new Map(
            action.payload.elements.map(({ elementId, element }) => [
              elementId,
              element,
            ]),
          ),
        ),
      };
      return state;

    default:
      return oldState;
  }
};

export default reducer;
