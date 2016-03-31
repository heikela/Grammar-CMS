import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import {
  SequenceExpansion,
  RepeatExpansion,
  Grammar,
  addToRepetition
} from './grammar';

const grammar = new Grammar(
  {
    root: [new SequenceExpansion(['title', 'questions'])],
    questions: [new RepeatExpansion('question')],
    question: [
      new SequenceExpansion(['openQuestion']),
      new SequenceExpansion(['multipleChoiceQuestion'])
    ],
    openQuestion: [new SequenceExpansion(['question', 'answer'])],
    multipleChoiceQuestion: [new SequenceExpansion(['question', 'answerChoices'])],
    answerChoices: [new RepeatExpansion('answerOption')],
    answerOption: [new SequenceExpansion(['answer', 'correctOrNot'])]
  }
);

const documentEditor = (oldState = grammar.initDocument(), action) => {
  switch (action.type) {
    case 'ADD_TO_SEQUENCE':
      return addToRepetition(grammar, oldState, action.path);
    default: return oldState;
  }
}

const store = createStore(documentEditor);

const DocumentEditor = (props) => {
  return (
    <div>
      <h1>Edit your new document here</h1>
      <Field {...props} />
    </div>
  )
}

const Field = (props) => {
  switch (props.element.type) {
    case 'SEQUENCE': return Sequence(props);
    case 'STRING': return StringField(props);
    case 'REPETITION': return Repetition(props);
    case 'UNKNOWN': return <div>Unknown element</div>;
    case 'INCOMPLETE_CHOICE': return ChoiceToMake(props);
    default: throw 'element type not understood in renderField()';
  }
}

const Sequence = (props) => {
  return (
    <div>
      {props.element.keys.map((key) => {
        return (
          <div key={key}>
            {key}
            <Field
              element={props.element.elements[key]}
              path={[...props.path, key]}
            />
          </div>
        );
      })}
    </div>
  )
}

const Repetition = (props) => {
  return (
    <div>
      {props.element.value.map((elem, i) => {
        return (
          <div key={''+i}>
            <Field
              element={elem}
              path={props.path}
            />
          </div>
        )
      })}
      <button
        onClick={(e) => {
          store.dispatch({
            type: 'ADD_TO_SEQUENCE',
            path: props.path
          })
        }}
      >
        Add Item
      </button>
    </div>
  )
}

const StringField = (props) => {
  return (
    <input type='text' />
  );
}

const ChoiceToMake = (props) => {
  return (
    <select>
      <option id='_not_chosen'>Choose Type</option>
      {
        props.element.alternateExpansions.map((term) => {
          const termString = term.toString();
          return <option key={termString} id={termString}>{termString}</option>;
        })
      }
    </select>
  );
}

const render = () => {
  const props = {
    element: store.getState(),
    path: []
  }
  ReactDOM.render(
    <DocumentEditor
      element={store.getState()}
      path={[]}
    />,
    document.getElementById('app'));
}

store.subscribe(render);
render();
