// @flow
import React, { Component } from 'react';
import type { SequenceElementData } from './Sequence';
import ElementContainer, {
  ElementHeading,
} from '../../DocumentEditor/ElementComponent';
import type {
  ElementComponentProps,
} from '../../DocumentEditor/ElementComponent';
import { sequenceTypeTag } from './Sequence';

type Props = ElementComponentProps;

export class SequenceComponent extends Component {
  props: Props;

  render() {
    const data: SequenceElementData = this.props.element.data;
    const fields = data.fields.map(field => (
      <div key={field}>
        <ElementHeading>
          <span>{field}: </span>
        </ElementHeading>
        <ElementContainer
          documentId={this.props.documentId}
          elementId={data.childElementIds.get(field)}
          grammar={this.props.grammar}
          componentRepository={this.props.componentRepository}
        />
      </div>
    ));
    return (
      <div>
        {fields}
      </div>
    );
  }
}

export const SequenceComponentType = {
  typeTag: sequenceTypeTag,
  component: SequenceComponent,
};
