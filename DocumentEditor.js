import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import {
  SequenceExpansion,
  RepeatExpansion,
  Grammar
} from './grammar';

import {
  addToRepetition,
  selectExpansion,
  updateString,
  removeFromRepetition
} from './document';

import { documentTestResult } from './documentTest';

require('./styles.css');

import {
  ImageTerm,
  NO_IMAGE,
  updateImage
} from './CloudinaryImage';

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET
} from './conf';

const grammar = new Grammar(
  {
    root: [new SequenceExpansion(['title', 'questions'])],
    title: [
      new SequenceExpansion(['titleString']),
      new SequenceExpansion(['image'])
    ],
    image: [new ImageTerm()],
    questions: [new RepeatExpansion('question')],
    question: [
      new SequenceExpansion(['openQuestion']),
      new SequenceExpansion(['multipleChoiceQuestion']),
    ],
    openQuestion: [new SequenceExpansion(['questionPrompt', 'answer'])],
    multipleChoiceQuestion: [new SequenceExpansion(['questionPrompt', 'answerChoices'])],
    answerChoices: [new RepeatExpansion('answerOption')],
    answerOption: [new SequenceExpansion(['answer', 'correctOrNot'])]
  }
);

const documentEditor = (oldState = grammar.initDocument(), action) => {
  switch (action.type) {
    case 'ADD_TO_SEQUENCE':
      return addToRepetition(grammar, oldState, action.path);
    case 'SELECT_EXPANSION':
      return selectExpansion(grammar, oldState, action.path, action.selected);
    case 'UPDATED_STRING':
      return updateString(oldState, action.path, action.updatedValue);
    case 'REMOVE_ELEMENT':
      return removeFromRepetition(oldState, action.path);
    case 'IMAGE_UPLOADED':
      return updateImage(oldState, action.path, action.url, action.width, action.height);
    default: return oldState;
  }
}

const store = createStore(documentEditor);

const DocumentEditor = (props) => {
  return (
    <div>
      <h1>Edit your new document here</h1>
      <Field {...props} />
      <hr />
      <pre>
        {JSON.stringify(props.element.objectForJson())}
      </pre>
    </div>
  )
}

/**
 * TODO see if you can make this explicit switch go away nicely.
 * Simply replacing it with OO method dispatch would force document elements
 * to care about presentation
 */
const Field = (props) => {
  switch (props.element.type) {
    case 'SEQUENCE': return Sequence(props);
    case 'STRING': return StringField(props);
    case 'REPETITION': return Repetition(props);
    case 'UNKNOWN': return <div>Unknown element</div>;
    case 'INCOMPLETE_CHOICE': return ChoiceToMake(props);
    case 'IMAGE': return ImageField(props);
    default: throw 'element type not understood in renderField()';
  }
}

const Sequence = (props) => {
  return (
    <div className='elementdiv'>
      {props.element.keys.map((key) => {
        return (
          <div className='elementdiv' key={key}>
            <div className='elementlabel'>{key}</div>
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
    <div className='elementdiv'>
      {props.element.elements.map((elem, i) => {
        const path = [...props.path, i];
        return (
          <div key={''+i}>
            <div className='elementlabel'>
              {props.element.typeToRepeat}
              <span onClick={(e) => {
                store.dispatch({
                  type: 'REMOVE_ELEMENT',
                  path: path
                });
              }}
              > (remove) </span>
            </div>
            <Field
              element={elem}
              path={path}
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
    <input
      type='text'
      onChange={
        (e) => {
          store.dispatch({
            type: 'UPDATED_STRING',
            path: props.path,
            updatedValue: e.target.value
          });
        }
      }
      value={props.element.value}
    />
  );
}

const ChoiceToMake = (props) => {
  return (
    <select onChange={(e) => {
      store.dispatch({
        type: 'SELECT_EXPANSION',
        path: props.path,
        selected: e.target.value
      })
    }}>
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

const ImageField = (props) => {
  if (props.element.url === NO_IMAGE) {
    return (
      <button
        onClick={
          (e) => {
            cloudinary.openUploadWidget({
              cloud_name: CLOUDINARY_CLOUD_NAME,
              upload_preset: CLOUDINARY_UPLOAD_PRESET
            },
            (error, result) => {
              if (error === null) {
                store.dispatch({
                  type: 'IMAGE_UPLOADED',
                  path: props.path,
                  url: result[0].url,
                  height: result[0].height,
                  width: result[0].width
                });
              } else {
                // TODO show error to the user
                console.log('Error uploading an image to Cloudinary:', error.message );
              }
            }
          )}
        }
      >
        upload image
      </button>
    );
  } else {
    return <div><img src={props.element.url} width='200px' height={(props.element.height / props.element.width * 200) + 'px'}/></div>;
  }
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
