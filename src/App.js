// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';
import { TextFieldComponentType } from './grammar/textField/TextFieldComponent';
import { SequenceComponentType } from './grammar/sequence/SequenceComponent';
import {
  RepetitionComponentType,
} from './grammar/repetition/RepetitionComponent';
import { ConstantComponentType } from './grammar/constant/ConstantComponent';
import Serialized from './serialize/SerializedViewer';

import reducer, {
  createDocument,
  ROOT_ELEMENT_ID,
} from './DocumentEditor/DocumentEditorState';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import grammarDocumentGrammar from './grammar/GrammarDocument';
import EditorWithGrammarFromDocument
  from './DocumentEditor/EditorWithGrammarFromDocument';

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(SequenceComponentType);
knownDocumentComponents.registerType(RepetitionComponentType);
knownDocumentComponents.registerType(MultipleChoiceComponentType);
knownDocumentComponents.registerType(TextFieldComponentType);
knownDocumentComponents.registerType(ConstantComponentType);

const grammarDoc = 'grammarDoc';
const dynamicDoc = 'dynamicDoc';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
store.dispatch(
  createDocument(
    grammarDoc,
    grammarDocumentGrammar.createElements(ROOT_ELEMENT_ID, 'root'),
  ),
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <div>
            <DocumentEditor
              documentId={grammarDoc}
              grammar={grammarDocumentGrammar}
              elementId="root"
              componentRepository={knownDocumentComponents}
            />
            <hr />
            <EditorWithGrammarFromDocument
              documentId={dynamicDoc}
              grammarDocumentId={grammarDoc}
              componentRepository={knownDocumentComponents}
            />
            <hr />
            <Serialized documentId={grammarDoc} />
            <hr />
            <Serialized documentId={dynamicDoc} />
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
