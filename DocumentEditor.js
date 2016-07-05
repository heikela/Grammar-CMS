import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Effects, loop } from 'redux-loop';

import {
  addToRepetition,
  selectExpansion,
  updateString,
  removeFromRepetition
} from './document';

import { quizzes } from './Quizzes';

require('./styles.css');

import {
  NO_IMAGE,
  updateImage
} from './CloudinaryImage';

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET
} from './conf';

const saveDocument = (document) => (
  {
    type: 'SAVE_DOCUMENT',
    doc: document
  }
);

export const documentEditor = (oldState = null, action) => {
  switch (action.type) {
    case 'CREATE_DOCUMENT':
      return quizzes.initDocument();
    case 'ADD_TO_SEQUENCE':
      return addToRepetition(quizzes, oldState, action.path);
    case 'SELECT_EXPANSION':
      return selectExpansion(quizzes, oldState, action.path, action.selected);
    case 'UPDATED_STRING':
      return updateString(oldState, action.path, action.updatedValue);
    case 'REMOVE_ELEMENT':
      return removeFromRepetition(oldState, action.path);
    case 'IMAGE_UPLOADED':
      return updateImage(oldState, action.path, action.url, action.width, action.height);
    case 'REQUEST_SAVE_DOCUMENT':
      return loop(
        oldState,
        Effects.constant(saveDocument(oldState))
      );
    case 'DOCUMENT_LOADED':
      return action.document;
    default: return oldState;
  }
};

const mapStateToProps = (state) => {
  return {
    element: state.documentEditor,
    path: []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    save: () => dispatch({type: 'REQUEST_SAVE_DOCUMENT'}),
    dispatch: dispatch
  };
};

const DocumentEditorPresentational = (props) => {
  if (props.element !== null) {
    return (
      <div>
        <h1>Edit your document here</h1>
        <button onClick={() => {props.save();}}>Save Document</button>
        <Field {...props} />
        <hr />
        <div>JSON Export</div>
        <pre>
          {JSON.stringify(props.element.objectForJson(), null, ' ')}
        </pre>
      </div>
    );
  } else {
    return (
      <div>No Document Loaded</div>
    );
  }
};
DocumentEditorPresentational.propTypes = {
  element: PropTypes.object,
  save: PropTypes.func.isRequired
};

export const DocumentEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentEditorPresentational);

// functions to render particular types of fields



const Sequence = (props) => {
  return (
    <div className='elementdiv'>
      {props.element.keys.map((key) => {
        return (
          <div className='elementdiv' key={key}>
            <div className='elementlabel'>{key}</div>
            <Field
              dispatch={props.dispatch}
              element={props.element.elements[key]}
              path={[...props.path, key]}
            />
          </div>
        );
      })}
    </div>
  );
};
Sequence.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  element: PropTypes.shape({
    keys: PropTypes.array.isRequired,
    elements: PropTypes.array.isRequired
  })
};

const Repetition = (props) => {
  return (
    <div className='elementdiv'>
      {props.element.elements.map((elem, i) => {
        const path = [...props.path, i];
        return (
          <div key={'' + i}>
            <div className='elementlabel'>
              {props.element.typeToRepeat}
              <span onClick={() => {
                props.dispatch({
                  type: 'REMOVE_ELEMENT',
                  path: path
                });
              }}
              > (remove) </span>
            </div>
            <Field
              dispatch={props.dispatch}
              element={elem}
              path={path}
            />
          </div>
        );
      })}
      <button
        onClick={() => {
          props.dispatch({
            type: 'ADD_TO_SEQUENCE',
            path: props.path
          });
        }}
      >
        Add Item
      </button>
    </div>
  );
};
Repetition.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  element: PropTypes.shape({
    typeToRepeat: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired
  })
};

const StringField = (props) => {
  return (
    <input
      className='string-field'
      type='text'
      onChange={
        (e) => {
          props.dispatch({
            type: 'UPDATED_STRING',
            path: props.path,
            updatedValue: e.target.value
          });
        }
      }
      value={props.element.value}
    />
  );
};
StringField.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  element: PropTypes.shape({
    value: PropTypes.string.isRequired
  })
};

const MultilineTextField = (props) => {
  return (
    <textarea
      className='multiline-text-field'
      onChange={
        (e) => {
          props.dispatch({
            type: 'UPDATED_STRING',
            path: props.path,
            updatedValue: e.target.value
          });
        }
      }
      value={props.element.value}
    />
  );
};
MultilineTextField.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  element: PropTypes.shape({
    value: PropTypes.string.isRequired
  })
};

const ChoiceToMake = (props) => {
  return (
    <select onChange={(e) => {
      props.dispatch({
        type: 'SELECT_EXPANSION',
        path: props.path,
        selected: e.target.value
      });
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
};

ChoiceToMake.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired,
  element: PropTypes.shape({
    alternateExpansions: PropTypes.array.isRequired
  })
};

const ImageField = (props) => {
  if (props.element.url === NO_IMAGE) {
    return (
      <button
        onClick={
          () => {
            cloudinary.openUploadWidget({
              /* eslint-disable camelcase */
              cloud_name: CLOUDINARY_CLOUD_NAME,
              upload_preset: CLOUDINARY_UPLOAD_PRESET
              /* eslint-enable camelcase */
            },
            (error, result) => {
              if (error === null) {
                props.dispatch({
                  type: 'IMAGE_UPLOADED',
                  path: props.path,
                  url: result[0].url,
                  height: result[0].height,
                  width: result[0].width
                });
              } else {
                // TODO show error to the user
                /* eslint-disable no-console */
                console.log('Error uploading an image to Cloudinary:', error.message );
                /* eslint-enable no-console */
              }
            }
          );}
        }
      >
        upload media
      </button>
    );
  } else if (props.element.url.slice(-3) === 'mp4') {
    return (
      <div>
        <video width={props.element.width} height={props.element.height} controls>
          <source src={props.element.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else {
    return <div><img src={props.element.url} width='200px' height={(props.element.height / props.element.width * 200) + 'px'}/></div>;
  }
};

ImageField.propTypes = {
  element: PropTypes.shape({
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.array.isRequired
};

/**
 * TODO see if you can make this explicit switch go away nicely.
 * Simply replacing it with OO method dispatch would force document elements
 * to care about presentation
 */
const Field = (props) => {
  switch (props.element.type) {
    case 'SEQUENCE': return Sequence(props);
    case 'STRING': return StringField(props);
    case 'MULTILINE_TEXT': return MultilineTextField(props);
    case 'REPETITION': return Repetition(props);
    case 'UNKNOWN': return <div>Unknown element</div>;
    case 'INCOMPLETE_CHOICE': return ChoiceToMake(props);
    case 'IMAGE': return ImageField(props);
    default: throw 'element type not understood in renderField()';
  }
};

Field.propTypes = {
  element: PropTypes.shape({
    type: PropTypes.string.isRequired
  })
};
