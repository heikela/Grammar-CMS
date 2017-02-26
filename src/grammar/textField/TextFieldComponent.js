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
    // TODO how can I autofocus this on mount
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
  handleChange: event => {
    const { target } = event;
    if (!(target instanceof window.HTMLInputElement)) {
      return;
    } else {
      dispatch(
        updateElement(
          ownProps.documentId,
          ownProps.elementId,
          new TextFieldData(target.value),
        ),
      );
    }
  },
});

const TextFieldContainer = connect(null, mapDispatchToProps)(
  TextFieldComponent,
);

export const TextFieldComponentType = {
  typeTag: textFieldTypeTag,
  component: TextFieldContainer,
};
