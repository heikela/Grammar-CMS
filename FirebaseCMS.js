import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

require('./styles.css');

import { FirebaseStorageProvider } from './FirebaseStorageProvider';

import {
  FIREBASE_REF
} from './conf';

import { listing, Listing } from './DocumentManager';
import { documentEditor, DocumentEditor } from './DocumentEditor';

import { install, combineReducers } from 'redux-loop';

const firebaseForCourses = new FirebaseStorageProvider(FIREBASE_REF);
import { login, Login } from './Login';

const cms = combineReducers({login, listing: listing(firebaseForCourses), documentEditor});

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

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <CMS />
    </Provider>,
    document.getElementById('app'));
};

store.subscribe(render);
render();
