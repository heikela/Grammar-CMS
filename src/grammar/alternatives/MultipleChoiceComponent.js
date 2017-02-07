// @flow
import React, { Component } from 'react';
import { alternativesTypeTag } from './Alternatives';

export class MultipleChoiceComponent extends Component {
  render() {
    const options = this.props.data.alternatives.map(alternative => (
      <option key={alternative} id={alternative}>{alternative}</option>
    ));
    return (
      <select>
        <option id="_not_chosen">Choose Type</option>
        {options}
      </select>
    );
  }
}

export const MultipleChoiceComponentType = {
  typeTag: alternativesTypeTag,
  component: MultipleChoiceComponent,
};

export default MultipleChoiceComponent;
