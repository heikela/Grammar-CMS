// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Repository from '../repository/Repository';
import DocumentEditor from './DocumentEditor';

import type { componentByTag } from './componentByTag';

import { createDocument, ROOT_ELEMENT_ID } from './DocumentEditorState';

import Grammar from '../grammar/Grammar';
import { grammarFromDocument } from '../grammar/GrammarDocument';

type OwnProps = {
  documentId: string,
  grammarDocumentId: string,
  componentRepository: Repository<componentByTag>,
};

type AdditionalProps = {
  createDocumentWithCurrentGrammar(): void,
};

type Props = OwnProps & AdditionalProps;
type State = {
  grammar: Grammar,
};

class EditorWithGrammarFromDocument extends Component {
  props: Props;
  state: State;
  render() {
    return (
      <div>
        <button
          onClick={e => {
            const grammar = grammarFromDocument(this.props.grammarDoc);
            if (grammar) {
              this.setState({ grammar });
              this.props.createDocumentWithGrammar(grammar);
            } else {
              alert('could not create a grammar from the grammar document');
            }
          }}
        >New document with the grammar above</button>
        {this.state && this.state.grammar
          ? <DocumentEditor
              documentId={this.props.documentId}
              grammar={this.state.grammar}
              componentRepository={this.props.componentRepository}
            />
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  grammarDoc: state ? state.elements.get(ownProps.grammarDocumentId) : null,
});

const mapDispatchToProps = (dispatch: Dispatch<*>, ownProps) => ({
  createDocumentWithGrammar: grammar => {
    dispatch(
      createDocument(
        ownProps.documentId,
        grammar.createElements(ROOT_ELEMENT_ID, 'root'),
      ),
    );
  },
});

const EditorWithGrammarFromDocumentContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorWithGrammarFromDocument);
export default EditorWithGrammarFromDocumentContainer;
