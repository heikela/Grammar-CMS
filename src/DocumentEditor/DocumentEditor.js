// @flow
import React, { Component } from 'react';
import Grammar from '../grammar/Grammar';

type Props = {
  grammar: Grammar,
  root: string,
};
class DocumentEditor extends Component {
  state: any;

  constructor(props: Props) {
    super(props);
    const grammar = props.grammar;
    const root = props.root;
    this.state = {
      document: grammar.createDocument(root),
    };
  }

  render() {
    return <div>{JSON.stringify(this.state.document)}</div>;
  }
}

export default DocumentEditor;
