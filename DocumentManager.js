import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thenify from 'thenify';
import { Provider } from 'react-redux';

require('./styles.css');

import { FirebaseStorageProvider } from './FirebaseStorageProvider';
import { DocumentType } from './DocumentType';

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  FIREBASE_REF
} from './conf';

import { documentEditor, DocumentEditor } from './DocumentEditor';
import { quizzes, initQuizzes } from './Quizzes';

import { install, loop, Effects, combineReducers } from 'redux-loop';

const listing = (oldState = [], action) => {
  switch (action.type) {
    case 'SAVE_DOCUMENT':
      return loop(
        oldState,
        Effects.promise(fetchListing)
      );
    case 'DOCUMENTS_LISTED':
      return action.listing;
    default: return oldState;
  }
}

const login = (oldState = {loginStatus:'NOT_LOGGED_IN', user:null, authMessage: ''}, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return loop(
        {
          loginStatus:'LOGGED_IN',
          user: action.user,
          authMessage: ''
        },
        Effects.promise(fetchListing)
      );
    case 'LOGGED_OUT':
      return {
        loginStatus:'NOT_LOGGED_IN',
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
}


function fetchListing() {
  var p = thenify(listQuizzes);
  return p().then((listing) => {
      return {
        type: 'DOCUMENTS_LISTED',
        listing: listing
      };
    }
  ).catch((e) => {
      return {
        type: 'DOCUMENT_LISTING_FAILED',
        message: e.message
      }
    }
  );
}

const cms = combineReducers({login, listing, documentEditor});

const enhancer = compose(
  install(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(cms, undefined, enhancer);

const firebaseForCourses = new FirebaseStorageProvider(
  FIREBASE_REF,
  (error, user) => {
    if (error !== null) {
      store.dispatch({
        type: 'AUTH_ERROR',
        message: "Error authenticating: " + error
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

const Login = ({login}) => {
  let emailField;
  let passwordField;
  if (login.loginStatus == 'LOGGED_IN') {
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
          <input type="text" ref={node => {emailField = node}}/>
        </label>
        <label>Password:
          <input type="password" ref={node => {passwordField = node}}/>
        </label>
        <div>
          <button onClick={
            (e) => {
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
}

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
}

const Listing = (props) => {
  return (
    <div>
      {
        props.listing.map((doc) => {
          return (
            <div
              key={doc.key}
              onClick={(e) => {quizDocumentType.load(doc.key)}}
            >
              {doc.title}
            </div>
          );
        }
      )}
      <button onClick={
        (e) => {
          store.dispatch({
            type: 'CREATE_DOCUMENT'
          })
        }
      }>
        Create New Document
      </button>
    </div>
  );
}

const render = () => {
  const props = {
    element: store.getState(),
    path: []
  }
  ReactDOM.render(
    <Provider store={store}>
      <CMS
        {...store.getState()}
      />
    </Provider>,
    document.getElementById('app'));
}

initQuizzes(firebaseForCourses, store);
const quizDocumentType = quizzes();

const listQuizzes = (callback) => {quizDocumentType.list(callback)}

store.subscribe(render);
render();
