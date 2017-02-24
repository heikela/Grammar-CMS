// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Grammar from '../grammar/Grammar';
import Repository from '../repository/Repository';

import type { documentElement } from '../grammar/Grammar';
import type { componentByTag } from './componentByTag';

import { getElement } from './DocumentEditorState';

export type ElementContainerProps = {
  documentId: string,
  elementId: string,
  grammar: Grammar,
  componentRepository: Repository<componentByTag>,
};

export type ElementComponentProps = $Subtype<
  & {
    element: documentElement,
  }
  & ElementContainerProps>;

class ElementComponent extends Component {
  props: ElementComponentProps;
  render() {
    const element = this.props.element;
    const componentRepository = this.props.componentRepository;
    const Renderer: ReactClass<*> = componentRepository.get(
      element.typeTag,
    ).component;
    return (
      <Renderer
        documentId={this.props.documentId}
        elementId={this.props.elementId}
        element={element}
        grammar={this.props.grammar}
        componentRepository={this.props.componentRepository}
      />
    );
  }
}

const ElementContainer = connect((state, ownProps: ElementContainerProps) => ({
  element: getElement(state, ownProps.documentId, ownProps.elementId),
}))(ElementComponent);

export default ElementContainer;
