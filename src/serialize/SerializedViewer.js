// @flow
import React from 'react';
import { connect } from 'react-redux';
import { serialize } from './serialize';
import { ROOT_ELEMENT_ID } from '../DocumentEditor/DocumentEditorState';
import type {
  documentEditorState,
} from '../DocumentEditor/DocumentEditorState';

type ComponentProps = {
  state: documentEditorState,
  documentId: string,
};

const SerializedViewer = (props: ComponentProps) => {
  return (
    <div>
      <pre>
        {JSON.stringify(
          serialize(props.state, props.documentId, ROOT_ELEMENT_ID),
          null,
          ' ',
        )}
      </pre>
    </div>
  );
};

const SerializedViewerContainer = connect((state: documentEditorState) => ({
  state: state,
}))(SerializedViewer);
SerializedViewerContainer.propTypes = {
  documentId: React.PropTypes.string.isRequired,
};

export default SerializedViewerContainer;
