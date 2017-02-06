// @flow
import React, { Component } from 'react';
import Grammar from '../grammar/Grammar';
import Repository from '../repository/Repository';

type Props = {
  grammar: Grammar,
  componentRepository: Repository<Component<*, *, *>>,
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
    const element = this.state.document;
    const componentRepository = this.props.componentRepository;
    const Renderer = componentRepository.get(element.typeTag).component;
    return <Renderer data={element} />;
  }
}

export default DocumentEditor;
