// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Alternatives from './grammar/alternatives/Alternatives';
import Constant from './grammar/constant/Constant';
import TextField from './grammar/textField/TextField';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';
import { ConstantComponentType } from './grammar/constant/ConstantComponent';
import { TextFieldComponentType } from './grammar/textField/TextFieldComponent';

import reducer, { createDocument } from './DocumentEditor/DocumentEditorState';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const grammar = new Grammar();
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(Constant.expansionType);
grammar.registerExpansionType(TextField.expansionType);
grammar.setExpansion('root', Alternatives.typeTag, ['email', 'phone', 'other']);
grammar.setExpansion('email', Constant.typeTag, 'some.email@example.com');
grammar.setExpansion('phone', Constant.typeTag, '+44123456789');
grammar.setExpansion('other', TextField.typeTag, '');

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(MultipleChoiceComponentType);
knownDocumentComponents.registerType(ConstantComponentType);
knownDocumentComponents.registerType(TextFieldComponentType);

const docName = '1stDoc';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
store.dispatch(createDocument(docName, grammar.createDocument('root')));

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
