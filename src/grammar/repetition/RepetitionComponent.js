// @flow
import React, { Component } from 'react';
import { repetitionTypeTag } from './Repetition';
import ElementComponentProps from '../../DocumentEditor/ElementComponent';

export class RepetitionComponent extends Component {
  props: ElementComponentProps;

  render() {
    return (
      <div>
        empty sequence of elements
      </div>
    );
  }
}

export const RepetitionComponentType = {
  typeTag: repetitionTypeTag,
  component: RepetitionComponent,
};
