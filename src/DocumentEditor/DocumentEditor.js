// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grammar from '../grammar/Grammar';
import Repository from '../repository/Repository';
import { Map } from 'immutable';
import ElementContainer from './ElementComponent';

import type { documentElement } from '../grammar/Grammar';
import type { componentByTag } from './componentByTag';

import { ROOT_ELEMENT_ID } from './DocumentEditorState';

type State = {
  elements: Map<string, Map<string, documentElement>>,
};

type OwnProps = {
  documentId: string,
  grammar: Grammar,
  componentRepository: Repository<componentByTag>,
};

type StateProps = {
  element: documentElement,
  elementId: string,
};

type Props = $Supertype<OwnProps & StateProps>;

class DocumentEditor extends Component {
  props: Props;
  render() {
    return (
      <ElementContainer
        documentId={this.props.documentId}
        elementId={this.props.elementId}
        grammar={this.props.grammar}
        componentRepository={this.props.componentRepository}
      />
    );
  }
}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    element: state.elements.get(ownProps.documentId).get(ROOT_ELEMENT_ID),
    elementId: ROOT_ELEMENT_ID,
  };
};

const DocumentEditorContainer = connect(mapStateToProps)(DocumentEditor);
export default DocumentEditorContainer;
