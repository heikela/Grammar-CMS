// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { repetitionTypeTag, appendChild, removeChild } from './Repetition';
import ElementContainer, {
  ElementHeading,
} from '../../DocumentEditor/ElementComponent';
import type {
  ElementComponentProps,
} from '../../DocumentEditor/ElementComponent';
import { genId } from '../../util';
import {
  addElements,
  updateElement,
} from '../../DocumentEditor/DocumentEditorState';

const AddNewElementButton = ({ addElement, termToRepeat }) => (
  <span onClick={addElement}>Add {termToRepeat}</span>
);

const RemoveButton = ({ removeElement }) => (
  <span onClick={removeElement}>Remove</span>
);

const RepetitionWrapper = ({ removeElement, index, elementId, children }) => (
  <div>
    <ElementHeading>
      {index + ': '}<RemoveButton removeElement={removeElement} />
    </ElementHeading>
    {children}
  </div>
);

type DispatchProps = {
  addElement(e: Event): void,
  removeElement(childElementId: string): void,
};

type Props = ElementComponentProps & DispatchProps;

export class RepetitionComponent extends Component {
  // TODO find out what would need to be done for this to be actually checked.
  // E.g. to remove the $SubType<...> from ElementComponentProps
  props: Props;

  render() {
    return (
      <div>
        {this.props.element.data.childElementIds.toArray().map((id, index) => (
          <RepetitionWrapper
            removeElement={e => this.props.removeElement(id)}
            index={index}
            elementId={id}
            key={id}
          >
            <ElementContainer
              componentRepository={this.props.componentRepository}
              grammar={this.props.grammar}
              documentId={this.props.documentId}
              elementId={id}
            />
          </RepetitionWrapper>
        ))}
        <AddNewElementButton
          addElement={this.props.addElement}
          termToRepeat={this.props.element.data.termToRepeat}
        />
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
  removeElement: childElementId => {
    dispatch(
      updateElement(
        ownProps.documentId,
        ownProps.elementId,
        removeChild(ownProps.element.data, childElementId),
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
