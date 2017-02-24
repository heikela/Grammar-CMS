// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alternativesTypeTag } from './Alternatives';
import MultipleChoice from './MultipleChoice';
import {
  createElement,
  updateElement,
} from '../../DocumentEditor/DocumentEditorState';
import { genId } from '../../util';
import ElementContainer from '../../DocumentEditor/ElementComponent';
import type {
  ElementComponentProps,
} from '../../DocumentEditor/ElementComponent';

type Props =
  & {
    handleChange(x: Event): void,
  }
  & ElementComponentProps;

export class MultipleChoiceComponent extends Component {
  props: Props;

  render() {
    const data: MultipleChoice = this.props.element.data;
    const options = data.alternatives.map(alternative => (
      <option key={alternative} id={alternative}>{alternative}</option>
    ));
    const select = (
      <select onChange={this.props.handleChange}>
        <option id="_not_chosen">Choose Type</option>
        {options}
      </select>
    );
    const child = data.selectedAlternative
      ? <ElementContainer
          documentId={this.props.documentId}
          elementId={data.selectedAlternative.childElementId}
          grammar={this.props.grammar}
          componentRepository={this.props.componentRepository}
        />
      : null;
    return (
      <div>
        {select}
        {child}
      </div>
    );
  }
}

const mapStateToProps = null;
const mapDispatchToProps = (dispatch: Dispatch<*>, ownProps) => {
  const result = {
    handleChange: e => {
      const chosenAlternative = e.target.value;
      const newElement = ownProps.grammar.createDocument(chosenAlternative);
      const newElementId = genId('elem');
      dispatch(createElement(ownProps.documentId, newElementId, newElement));
      dispatch(
        updateElement(
          ownProps.documentId,
          ownProps.elementId,
          ownProps.element.data.select(chosenAlternative, newElementId),
        ),
      );
    },
  };
  console.log(result);
  return result;
};

const MultipleChoiceContainer = connect(mapStateToProps, mapDispatchToProps)(
  MultipleChoiceComponent,
);

export const MultipleChoiceComponentType = {
  typeTag: alternativesTypeTag,
  component: MultipleChoiceContainer,
};
