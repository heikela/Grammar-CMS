// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Sequence from './grammar/sequence/Sequence';
import Alternatives from './grammar/alternatives/Alternatives';
import TextField from './grammar/textField/TextField';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';
import { TextFieldComponentType } from './grammar/textField/TextFieldComponent';
import { SequenceComponentType } from './grammar/sequence/SequenceComponent';

import reducer, {
  createDocument,
  ROOT_ELEMENT_ID,
} from './DocumentEditor/DocumentEditorState';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const grammar = new Grammar();
grammar.registerExpansionType(Sequence.expansionType);
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(TextField.expansionType);
grammar.setExpansion('root', Sequence.typeTag, ['name', 'contact']);
grammar.setExpansion('name', TextField.typeTag, '');
grammar.setExpansion('contact', Alternatives.typeTag, ['email', 'phone']);
grammar.setExpansion('email', TextField.typeTag, '');
grammar.setExpansion('phone', TextField.typeTag, '');

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(SequenceComponentType);
knownDocumentComponents.registerType(MultipleChoiceComponentType);
knownDocumentComponents.registerType(TextFieldComponentType);

const docName = '1stDoc';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
store.dispatch(
  createDocument(docName, grammar.createElements(ROOT_ELEMENT_ID, 'root')),
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <DocumentEditor
            documentId={docName}
            grammar={grammar}
            elementId="root"
            componentRepository={knownDocumentComponents}
          />
        </Provider>
      </div>
    );
  }
}

export default App;
