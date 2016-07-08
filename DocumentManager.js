import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { loop, Effects } from 'redux-loop';

import { saveDocument, loadDocument, fetchListing } from './DocumentStorageActions';

export const listing = (storageProvider) => (oldState = [], action) => {
  switch (action.type) {
    case 'SAVE_DOCUMENT':
      return loop(
        oldState,
        Effects.promise(saveDocument, storageProvider, action.doc)
      );
    case 'LIST_DOCUMENTS':
    case 'DOCUMENT_SAVED':
      return loop(
        oldState,
        Effects.promise(fetchListing, storageProvider)
      );
    case 'DOCUMENTS_LISTED':
      return action.listing;
    case 'LOAD_DOCUMENT':
      return loop(
        oldState,
        Effects.promise(loadDocument, storageProvider, action.ref)
      );
    default: return oldState;
  }
};

const ListingPresentational = (props) => {
  return (
    <div>
      {
        props.listing.map((doc) => {
          return (
            <div
              key={doc.key}
              onClick={() => {props.requestLoadDocument(doc.key);}}
            >
              {doc.title}
            </div>
          );
        }
      )}
      <button onClick={() => {props.createDocument();}}
      >
        Create New Document
      </button>
    </div>
  );
};
ListingPresentational.propTypes = {
  listing: PropTypes.array.isRequired,
  requestLoadDocument: PropTypes.func.isRequired,
  createDocument: PropTypes.func.isRequired
};

const mapStateToPropsForListing = (state) => {
  return {
    listing: state.listing
  };
};

const mapDispatchToPropsForListing = (dispatch) => {
  return {
    requestLoadDocument: (ref) => dispatch({type: 'LOAD_DOCUMENT', ref: ref}),
    createDocument: () => dispatch({type: 'CREATE_DOCUMENT'})
  };
};

export const Listing = connect(
  mapStateToPropsForListing,
  mapDispatchToPropsForListing
)(ListingPresentational);
