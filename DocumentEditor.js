import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import { initDocument } from './grammar';

const DocumentEditor = (props) => {
  return (
    <div>
      <h1>Edit your new document here</h1>
      <Sequence {...props} />
    </div>
  )
}

const renderField = (props) => {
  switch (props.type) {
    case 'SEQUENCE': return Sequence(props);
    case 'STRING': return StringField(props);
    case 'REPETITION': return Repetition(props);
  }
}

const Sequence = (props) => {
  return (
    <div>
      {props.elements.map((elem) => {
        return (
          <div key={elem.fieldName}>
            {elem.fieldName}
            {renderField(elem)}
          </div>
        );
      })}
    </div>
  )
}

const Repetition = (props) => {
  return (
    <div>
      <button>Add Item</button>
    </div>
  )
}

const StringField = (props) => {
  return (
    <input type='text' />
  );
}

const documentEditor = (oldState = initDocument(), action) => {
  switch (action.type) {
    default: return oldState;
  }
}

const store = createStore(documentEditor);

const render = () => {
  ReactDOM.render(<DocumentEditor {...store.getState()} />,
    document.getElementById('app'));
}

store.subscribe(render);
render();
