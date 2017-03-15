// @flow

import React, { Component } from 'react';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Sequence from './grammar/sequence/Sequence';
import Repetition from './grammar/repetition/Repetition';
import Alternatives from './grammar/alternatives/Alternatives';
import TextField from './grammar/textField/TextField';
import Constant from './grammar/constant/Constant';
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

const grammar = new Grammar();
grammar.registerExpansionType(Sequence.expansionType);
grammar.registerExpansionType(Repetition.expansionType);
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(TextField.expansionType);
grammar.registerExpansionType(Constant.expansionType);
grammar.setExpansion('root', Alternatives.typeTag, [
  'sequence',
  'repetition',
  'alternatives',
  'textField',
  'constant',
]);
grammar.setExpansion('term', Alternatives.typeTag, [
  'sequence',
  'repetition',
  'alternatives',
  'textField',
  'constant',
]);
grammar.setExpansion('sequence', Repetition.typeTag, 'expansion');
grammar.setExpansion('expansion', Sequence.typeTag, ['termName', 'term']);
grammar.setExpansion('repetition', Sequence.typeTag, ['expansion']);
grammar.setExpansion('termName', TextField.typeTag, '');
grammar.setExpansion('alternatives', Repetition.typeTag, 'expansion');
grammar.setExpansion('textField', Constant.typeTag, '_textField');
grammar.setExpansion('constant', Sequence.typeTag, ['value']);
grammar.setExpansion('value', TextField.typeTag, '');

grammar.setExpansion('docRoot', Repetition.typeTag, 'customer');
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
knownDocumentComponents.registerType(ConstantComponentType);

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
