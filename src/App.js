// @flow

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DocumentEditor from './DocumentEditor/DocumentEditor';
import Grammar from './grammar/Grammar';
import Alternatives from './grammar/alternatives/Alternatives';
import Constant from './grammar/constant/Constant';
import Repository from './repository/Repository';
import {
  MultipleChoiceComponentType,
} from './grammar/alternatives/MultipleChoiceComponent';

const grammar = new Grammar();
grammar.registerExpansionType(Alternatives.expansionType);
grammar.registerExpansionType(Constant.expansionType);
grammar.setExpansion('root', Alternatives.typeTag, ['email', 'phone']);

const knownDocumentComponents = new Repository();
knownDocumentComponents.registerType(MultipleChoiceComponentType);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <DocumentEditor
          grammar={grammar}
          root="root"
          componentRepository={knownDocumentComponents}
        />
      </div>
    );
  }
}

export default App;
