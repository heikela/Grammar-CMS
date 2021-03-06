// @flow

import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Repository from '../../repository/Repository';

import DocumentEditor from '../../DocumentEditor/DocumentEditor';

import reducer, {
  createDocument,
  getElement,
  ROOT_ELEMENT_ID,
} from '../../DocumentEditor/DocumentEditorState';

import Repetition from './Repetition';
import Constant from '../constant/Constant';
import Grammar from '../Grammar';

import { RepetitionComponentType } from './RepetitionComponent';
import { ConstantComponentType } from '../constant/ConstantComponent';

describe('Repetition component', () => {
  let store;
  let subject;

  const docName = 'testDocument';

  beforeEach(() => {
    store = createStore(reducer);

    const knownDocumentComponents = new Repository();
    knownDocumentComponents.registerType(RepetitionComponentType);
    knownDocumentComponents.registerType(ConstantComponentType);

    let grammar = new Grammar();
    grammar.registerExpansionType(Repetition.expansionType);
    grammar.registerExpansionType(Constant.expansionType);
    grammar.setExpansion('root', Repetition.typeTag, 'contact');
    grammar.setExpansion('contact', Constant.typeTag, 'someone@example.com');

    store.dispatch(
      createDocument(docName, grammar.createElements(ROOT_ELEMENT_ID, 'root')),
    );

    subject = mount(
      <Provider store={store}>
        <DocumentEditor
          documentId={docName}
          grammar={grammar}
          elementId="root"
          componentRepository={knownDocumentComponents}
        />
      </Provider>,
    );
  });

  it('renders without crashing', () => {});

  it('allows adding new elements to the repetition', () => {
    const repetitionComponent = subject.find(RepetitionComponentType.component);
    expect(repetitionComponent.exists()).toBeTruthy();
    const addNewElementButton = subject.find('AddNewElementButton');
    expect(addNewElementButton.exists()).toBeTruthy();
    addNewElementButton.simulate('click');
    const state = store.getState();
    const repetitionElement = getElement(state, docName, 'root');
    expect(repetitionElement).toBeTruthy();
    if (repetitionElement) {
      const childElementIds = repetitionElement.data.childElementIds;
      expect(childElementIds.size).toEqual(1);
      const addedChildElement = childElementIds.get(0);
      expect(getElement(state, docName, addedChildElement)).toEqual({
        typeTag: 'CONSTANT',
        data: 'someone@example.com',
      });
      const firstChildComponent = repetitionComponent.find('ElementComponent');
      expect(firstChildComponent.exists()).toBeTruthy();
      expect(firstChildComponent.props().elementId).toEqual(addedChildElement);
    }
  });

  it('allows removing elements from the repetition', () => {
    const repetitionComponent = subject.find(RepetitionComponentType.component);
    expect(repetitionComponent.exists()).toBeTruthy();
    const addNewElementButton = subject.find('AddNewElementButton');
    expect(addNewElementButton.exists()).toBeTruthy();
    addNewElementButton.simulate('click');
    addNewElementButton.simulate('click');
    addNewElementButton.simulate('click');
    const state = store.getState();
    const repetitionElement = getElement(state, docName, 'root');
    expect(repetitionElement).toBeTruthy();
    if (repetitionElement) {
      const originalChildElementIds = repetitionElement.data.childElementIds;
      expect(originalChildElementIds.size).toEqual(3);
      const middleChildElementId = originalChildElementIds.get(1);
      const middleChildRepetitionWrapper = repetitionComponent.findWhere(
        reactWrapper => {
          return reactWrapper.name() === 'RepetitionWrapper' &&
            reactWrapper.props().elementId === middleChildElementId;
        },
      );
      const removeButton = middleChildRepetitionWrapper.find('RemoveButton');
      removeButton.simulate('click');
      const updatedRepetitionElement = getElement(
        store.getState(),
        docName,
        'root',
      );
      expect(updatedRepetitionElement).toBeTruthy();
      if (updatedRepetitionElement) {
        const newChildElementIds = updatedRepetitionElement.data.childElementIds;
        expect(newChildElementIds.size).toEqual(2);
        expect(newChildElementIds.get(0)).toEqual(
          originalChildElementIds.get(0),
        );
        expect(newChildElementIds.get(1)).toEqual(
          originalChildElementIds.get(2),
        );
      }
    }
  });
});
