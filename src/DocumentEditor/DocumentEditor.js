// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grammar from '../grammar/Grammar';
import Repository from '../repository/Repository';
import { Map } from 'immutable';

import type { documentElement } from '../grammar/Grammar';

interface componentByTag {
  typeTag: string,
  component: ReactClass<*>,
}

type State = {
  elements: Map<string, Map<string, documentElement>>,
};

type OwnProps = {
  documentId: string,
  elementId: string,
  grammar: Grammar,
  componentRepository: Repository<componentByTag>,
  root: string,
};

type StateProps = {
  element: documentElement,
};

type DispatchProps = {
  updateElement(elementId: string, newValue: mixed): void,
};

type Props = $Supertype<OwnProps & StateProps & DispatchProps>;

class DocumentEditor extends Component {
  props: Props;
  render() {
    const element = this.props.element;
    const componentRepository = this.props.componentRepository;
    const Renderer: ReactClass<*> = componentRepository.get(
      element.typeTag,
    ).component;
    return <Renderer data={element.data} />;
  }
}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    element: state.elements.get(ownProps.documentId).get(ownProps.elementId),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<*>,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    updateElement: (dispatch, ownProps) => {},
  };
};

const DocumentEditorContainer = connect(mapStateToProps, mapDispatchToProps)(
  DocumentEditor,
);
export default DocumentEditorContainer;
