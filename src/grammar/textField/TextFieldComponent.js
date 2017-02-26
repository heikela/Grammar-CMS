// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { textFieldTypeTag } from './TextField';
import ElementComponentProps from '../../DocumentEditor/ElementComponent';
import { updateElement } from '../../DocumentEditor/DocumentEditorState';
import { TextFieldData } from './TextFieldData';

type DispatchProps = {
  handleChange(e: Event): void,
};

type Props = ElementComponentProps & DispatchProps;

export class TextFieldComponent extends Component {
  props: Props;

  render() {
    return (
      <input
        value={this.props.element.data.value}
        onChange={this.props.handleChange}
      />
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<*>,
  ownProps: ElementComponentProps,
): DispatchProps => ({
  handleChange: (e: Event) => {
    dispatch(
      updateElement(
        ownProps.documentId,
        ownProps.elementId,
        new TextFieldData(e.target.value),
      ),
    );
  },
});

const TextFieldContainer = connect(null, mapDispatchToProps)(
  TextFieldComponent,
);

export const TextFieldComponentType = {
  typeTag: textFieldTypeTag,
  component: TextFieldContainer,
};
