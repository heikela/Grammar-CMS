// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Sequence from './grammar/sequence/Sequence';
import Repetition from './grammar/repetition/Repetition';
import Alternatives from './grammar/alternatives/Alternatives';
import TextField from './grammar/textField/TextField';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';
import { TextFieldComponentType } from './grammar/textField/TextFieldComponent';
import { SequenceComponentType } from './grammar/sequence/SequenceComponent';
import {
  RepetitionComponentType,
} from './grammar/repetition/RepetitionComponent';
import Serialized from './serialize/SerializedViewer';

import reducer, {
  createDocument,
  ROOT_ELEMENT_ID,
} from './DocumentEditor/DocumentEditorState';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const grammar = new Grammar();
grammar.registerExpansionType(Sequence.expansionType);
grammar.registerExpansionType(Repetition.expansionType);
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(TextField.expansionType);
grammar.setExpansion('root', Repetition.typeTag, 'customer');
grammar.setExpansion('customer', Sequence.typeTag, ['name', 'contact']);
grammar.setExpansion('name', TextField.typeTag, '');
grammar.setExpansion('contact', Alternatives.typeTag, ['email', 'phone']);
grammar.setExpansion('email', TextField.typeTag, '');
grammar.setExpansion('phone', TextField.typeTag, '');

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(SequenceComponentType);
knownDocumentComponents.registerType(RepetitionComponentType);
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
          <div>
            <DocumentEditor
              documentId={docName}
              grammar={grammar}
              elementId="root"
              componentRepository={knownDocumentComponents}
            />
            <hr />
            <Serialized documentId={docName} />
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
