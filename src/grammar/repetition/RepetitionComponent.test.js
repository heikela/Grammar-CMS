// @flow

import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Repository from '../../repository/Repository';

import DocumentEditor from '../../DocumentEditor/DocumentEditor';

import reducer, {
  createDocument,
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

  beforeEach(() => {
    store = createStore(reducer);

    const knownDocumentComponents = new Repository();
    knownDocumentComponents.registerType(RepetitionComponentType);
    knownDocumentComponents.registerType(ConstantComponentType);

    const docName = 'testDocument';

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
});
