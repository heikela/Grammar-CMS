import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';

require('./styles.css');

import { LocalStorageStorageProvider } from './LocalStorageStorageProvider';

import { listing, Listing } from './DocumentManager';
import { documentEditor, DocumentEditor } from './DocumentEditor';

import { install, combineReducers } from 'redux-loop';

const storage = new LocalStorageStorageProvider('games');

const cms = combineReducers({listing: listing(storage), documentEditor});

const enhancer = compose(
  install(),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(cms, undefined, enhancer);
store.dispatch({type: 'LIST_DOCUMENTS'});

const CMS = () => {
  return (
    <div>
      <h1>Create or edit a game</h1>
      <h2>Existing games</h2>
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
