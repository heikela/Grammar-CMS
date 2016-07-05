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

const login = (oldState = {loginStatus: 'NOT_LOGGED_IN', user: null, authMessage: ''}, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return loop(
        {
          loginStatus: 'LOGGED_IN',
          user: action.user,
          authMessage: ''
        },
        Effects.promise(fetchListing)
      );
    case 'LOGGED_OUT':
      return {
        loginStatus: 'NOT_LOGGED_IN',
        user: null,
        authMessage: ''
      };
    case 'AUTH_ERROR':
      return {
        ...oldState,
        authMessage: action.message
      };
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

/* eslint-disable no-shadow */
const Login = ({login}) => {
  /* eslint-enable no-shadow */
  let emailField;
  let passwordField;
  if (login.loginStatus === 'LOGGED_IN') {
    return (
      <div>
        Logged in as {login.user.email}
        <button onClick={()=>firebaseForCourses.logout()}>Logout</button>
      </div>
    );
  } else {
    return (
      <div>
        <p>Please Login</p>
        <label>Email:
          <input type="text" ref={node => {emailField = node;}}/>
        </label>
        <label>Password:
          <input type="password" ref={node => {passwordField = node;}}/>
        </label>
        <div>
          <button onClick={
            () => {
              firebaseForCourses.login(emailField.value, passwordField.value);
              emailField.value = '';
              passwordField.value = '';
            }
          }>
            Login
          </button>
        </div>
      </div>
    );
  }
};
Login.propTypes = {
  login: PropTypes.shape({
    loginStatus: PropTypes.string.isRequired,
    user: PropTypes.object
  })
};

const CMS = (props) => {
  return (
    <div>
      <Login login={props.login}/>
      <hr />
      <h1>Create or edit a document</h1>
      <h2>Existing documents</h2>
      <Listing listing={props.listing}/>
      <hr />
      <DocumentEditor />
    </div>
  );
};
CMS.propTypes = {
  login: PropTypes.object.isRequired,
  listing: PropTypes.array.isRequired
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

const mapDispatchToPropsForListing = (dispatch) => {
  return {
    requestLoadDocument: (ref) => dispatch({type: 'LOAD_DOCUMENT', ref: ref})
  };
};

const Listing = connect(
  null,
  mapDispatchToPropsForListing
)(ListingPresentational);

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CMS
        {...store.getState()}
      />
    </Provider>,
    document.getElementById('app'));
};

store.subscribe(render);
render();
