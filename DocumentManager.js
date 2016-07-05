import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import thenify from 'thenify';
import { Provider, connect } from 'react-redux';

require('./styles.css');

import { FirebaseStorageProvider } from './FirebaseStorageProvider';

import {
  FIREBASE_REF
} from './conf';

import { documentEditor, DocumentEditor } from './DocumentEditor';

import { install, loop, Effects, combineReducers } from 'redux-loop';

const firebaseForCourses = new FirebaseStorageProvider(FIREBASE_REF);
import { login, Login } from './Login';

const loadDocument = (reference) => {
  const p = thenify((ref, callback) => {firebaseForCourses.load(ref, callback);});
  return p(reference).then((document) => {
      return {
        type: 'DOCUMENT_LOADED',
        document: document
      };
    }
  ).catch((e) => {
      return {
        type: 'DOCUMENT_LOAD_FAILED',
        error: e
      };
    }
  );
};

const saveDocument = (document) => {
  const p = thenify((doc, callback) => {firebaseForCourses.save(doc, callback);});
  return p(document).then(() => {
      return {
        type: 'DOCUMENT_SAVED'
      };
    }
  ).catch(() => {
      return {
        type: 'SAVING_DOCUMENT_FAILED'
      };
    }
  );
};

const fetchListing = () => {
  const p = thenify((callback) => {firebaseForCourses.list(callback);});
  return p().then((result) => {
      return {
        type: 'DOCUMENTS_LISTED',
        listing: result
      };
    }
  ).catch((e) => {
      return {
        type: 'DOCUMENT_LISTING_FAILED',
        message: e.message
      };
    }
  );
};

const listing = (oldState = [], action) => {
  switch (action.type) {
    case 'SAVE_DOCUMENT':
      return loop(
        oldState,
        Effects.promise(saveDocument, action.doc)
      );
    case 'LIST_DOCUMENTS':
    case 'DOCUMENT_SAVED':
      return loop(
        oldState,
        Effects.promise(fetchListing)
      );
    case 'DOCUMENTS_LISTED':
      return action.listing;
    case 'LOAD_DOCUMENT':
      return loop(
        oldState,
        Effects.promise(loadDocument, action.ref)
      );
    default: return oldState;
  }
};

const cms = combineReducers({login, listing, documentEditor});

const enhancer = compose(
  install(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(cms, undefined, enhancer);

firebaseForCourses.initAuthClient(
  (error, user) => {
    if (error !== null) {
      store.dispatch({
        type: 'AUTH_ERROR',
        message: 'Error authenticating: ' + error
      });
    } else if (user !== null) {
      store.dispatch({
        type: 'LOGGED_IN',
        user: user
      });
    } else {
      store.dispatch({
        type: 'LOGGED_OUT'
      });
    }
  }
);

const CMS = () => {
  return (
    <div>
      <Login
        doLogin={(username, password) => firebaseForCourses.login(username, password)}
        logout={() => firebaseForCourses.logout()}
      />
      <hr />
      <h1>Create or edit a document</h1>
      <h2>Existing documents</h2>
      <Listing />
      <hr />
      <DocumentEditor />
    </div>
  );
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
      <button onClick={
        () => {
          store.dispatch({
            type: 'CREATE_DOCUMENT'
          });
        }
      }>
        Create New Document
      </button>
    </div>
  );
};
ListingPresentational.propTypes = {
  listing: PropTypes.array.isRequired,
  requestLoadDocument: PropTypes.func.isRequired
};

const mapStateToPropsForListing = (state) => {
  return {
    listing: state.listing
  };
};

const mapDispatchToPropsForListing = (dispatch) => {
  return {
    requestLoadDocument: (ref) => dispatch({type: 'LOAD_DOCUMENT', ref: ref})
  };
};

const Listing = connect(
  mapStateToPropsForListing,
  mapDispatchToPropsForListing
)(ListingPresentational);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CMS />
    </Provider>,
    document.getElementById('app'));
};

store.subscribe(render);
render();
