// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Alternatives from './grammar/alternatives/Alternatives';
import Constant from './grammar/constant/Constant';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';

import reducer, { createDocument } from './DocumentEditor/DocumentEditorState';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const grammar = new Grammar();
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(Constant.expansionType);
grammar.setExpansion('root', Alternatives.typeTag, ['email', 'phone']);

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(MultipleChoiceComponentType);

const docName = '1stDoc';

const store = createStore(reducer);
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
