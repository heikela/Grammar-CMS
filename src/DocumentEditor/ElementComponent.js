// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

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

// TODO too flexible?
export type ElementComponentProps = $Subtype<
  & {
    element: documentElement,
  }
  & ElementContainerProps>;

const StyledElementComponent = styled.div`
  border: 2px solid #999;
  border-radius: 2px;
  padding: 3px;
`;

export const ElementHeading = styled.div`
  background-color: #999;
`;

class ElementComponent extends Component {
  props: ElementComponentProps;
  render() {
    const element = this.props.element;
    const componentRepository = this.props.componentRepository;
    const Renderer: ReactClass<*> = componentRepository.get(
      element.typeTag,
    ).component;
    return (
      <StyledElementComponent>
        <Renderer
          documentId={this.props.documentId}
          elementId={this.props.elementId}
          element={element}
          grammar={this.props.grammar}
          componentRepository={this.props.componentRepository}
        />
      </StyledElementComponent>
    );
  }
}

const ElementContainer = connect((state, ownProps: ElementContainerProps) => ({
  element: getElement(state, ownProps.documentId, ownProps.elementId),
}))(ElementComponent);

export default ElementContainer;
