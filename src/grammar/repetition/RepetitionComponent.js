// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appendChild, repetitionTypeTag } from './Repetition';
import ElementContainer from '../../DocumentEditor/ElementComponent';
import type {
  ElementComponentProps,
} from '../../DocumentEditor/ElementComponent';
import { genId } from '../../util';
import {
  addElements,
  updateElement,
} from '../../DocumentEditor/DocumentEditorState';

const AddNewElementButton = ({ addElement }) => (
  <span onClick={addElement}>Add Element</span>
);

type DispatchProps = {
  addElement(e: Event): void,
};

type Props = ElementComponentProps & DispatchProps;

export class RepetitionComponent extends Component {
  props: ElementComponentProps;

  render() {
    return (
      <div>
        {this.props.element.data.childElementIds
          .toArray()
          .map(id => (
            <ElementContainer
              componentRepository={this.props.componentRepository}
              grammar={this.props.grammar}
              documentId={this.props.documentId}
              key={id}
              elementId={id}
            />
          ))}
        <AddNewElementButton addElement={this.props.addElement} />
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<*>,
  ownProps: ElementComponentProps,
): DispatchProps => ({
  addElement: event => {
    const grammar = ownProps.grammar;
    const termToRepeat = ownProps.element.data.termToRepeat;
    const newId = genId('elem');
    const newElements = grammar.createElements(termToRepeat, newId);
    dispatch(addElements(ownProps.documentId, newElements));
    dispatch(
      updateElement(
        ownProps.documentId,
        ownProps.elementId,
        appendChild(ownProps.element.data, newId),
      ),
    );
  },
});

const RepetitionContainer = connect(null, mapDispatchToProps)(
  RepetitionComponent,
);

export const RepetitionComponentType = {
  typeTag: repetitionTypeTag,
  component: RepetitionContainer,
};
