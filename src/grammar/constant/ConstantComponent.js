// @flow
import React, { Component } from 'react';
import { constantTypeTag } from './Constant';
import ElementComponentProps from '../../DocumentEditor/ElementComponent';

export class ConstantComponent extends Component {
  props: ElementComponentProps;

  render() {
    const serialized = JSON.stringify(this.props.element.data);
    return (
      <div>
        {serialized}
      </div>
    );
  }
}

export const ConstantComponentType = {
  typeTag: constantTypeTag,
  component: ConstantComponent,
};
