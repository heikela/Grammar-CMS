// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { alternativesTypeTag } from './Alternatives';
import MultipleChoice from './MultipleChoice';
import {
  addElements,
  updateElement,
} from '../../DocumentEditor/DocumentEditorState';
import { genId } from '../../util';
import ElementContainer, {
  ElementHeading,
} from '../../DocumentEditor/ElementComponent';
import type {
  ElementComponentProps,
} from '../../DocumentEditor/ElementComponent';

type Props =
  & {
    handleSelection(selection: string): void,
  }
  & ElementComponentProps;

const NO_SELECTION = '_not_chosen';

const ReselectButton = ({ reselect }) => (
  <span onClick={reselect}>Reselect</span>
);

export class MultipleChoiceComponent extends Component {
  props: Props;

  render() {
    const data: MultipleChoice = this.props.element.data;
    if (data.selectedAlternative) {
      return (
        <div>
          <ElementHeading>
            {data.selectedAlternative.chosenAlternative}
            {': '}
            <ReselectButton
              reselect={() => this.props.handleSelection(NO_SELECTION)}
            />
          </ElementHeading>
          <ElementContainer
            documentId={this.props.documentId}
            elementId={data.selectedAlternative.childElementId}
            grammar={this.props.grammar}
            componentRepository={this.props.componentRepository}
          />
        </div>
      );
    } else {
      const options = data.alternatives.map(alternative => (
        <option key={alternative} value={alternative}>{alternative}</option>
      ));
      const select = (
        <select onChange={e => this.props.handleSelection(e.target.value)}>
          <option value={NO_SELECTION}>Choose Type</option>
          {options}
        </select>
      );
      return (
        <div>
          <ElementHeading>
            {select}
          </ElementHeading>
        </div>
      );
    }
  }
}

const mapStateToProps = null;
const mapDispatchToProps = (dispatch: Dispatch<*>, ownProps) => ({
  handleSelection: (chosenAlternative: string) => {
    if (chosenAlternative !== NO_SELECTION) {
      const newElementId = genId('elem');
      const newElements = ownProps.grammar.createElements(
        chosenAlternative,
        newElementId,
      );
      dispatch(addElements(ownProps.documentId, newElements));
      dispatch(
        updateElement(
          ownProps.documentId,
          ownProps.elementId,
          ownProps.element.data.select(chosenAlternative, newElementId),
        ),
      );
    } else {
      dispatch(
        updateElement(
          ownProps.documentId,
          ownProps.elementId,
          ownProps.element.data.deselect(),
        ),
      );
    }
  },
});

const MultipleChoiceContainer = connect(mapStateToProps, mapDispatchToProps)(
  MultipleChoiceComponent,
);

export const MultipleChoiceComponentType = {
  typeTag: alternativesTypeTag,
  component: MultipleChoiceContainer,
};
