import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thenify from 'thenify';

import {
  SequenceExpansion,
  RepeatExpansion,
  AlternativesExpansion,
  MultiLineTextExpansion,
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

import { FirebaseStorageProvider } from './FirebaseStorageProvider';
import { DocumentType } from './DocumentType';

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  FIREBASE_REF
} from './conf';

import { install, loop, Effects, combineReducers } from 'redux-loop';

const documentEditor = (oldState = null, action) => {
  switch (action.type) {
    case 'CREATE_DOCUMENT':
      return quizzes.grammar.initDocument();
    case 'ADD_TO_SEQUENCE':
      return addToRepetition(quizzes.grammar, oldState, action.path);
    case 'SELECT_EXPANSION':
      return selectExpansion(quizzes.grammar, oldState, action.path, action.selected);
    case 'UPDATED_STRING':
      return updateString(oldState, action.path, action.updatedValue);
    case 'REMOVE_ELEMENT':
      return removeFromRepetition(oldState, action.path);
    case 'IMAGE_UPLOADED':
      return updateImage(oldState, action.path, action.url, action.width, action.height);
    case 'SAVE_DOCUMENT':
      quizzes.save(oldState);
      return loop(
        oldState,
        Effects.promise(fetchListing)
      );
    case 'DOCUMENT_LOADED':
      return action.document;
    default: return oldState;
  }
}

const listing = (oldState = [], action) => {
  switch (action.type) {
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

const quizzes = new DocumentType(
  new Grammar(
    {
      root: new SequenceExpansion(['title', 'modules']),
      modules: new RepeatExpansion(['module']),
      module: new SequenceExpansion(['title', 'steps', 'completion']),
      steps: new RepeatExpansion(['step']),
      step: new SequenceExpansion(['title', 'activities']),
      activities: new RepeatExpansion(['activity']),
      activity: new AlternativesExpansion(
        [
          'introduction',
          'video',
          'quiz',
          'text',
          'completion'
        ]
      ),
      quiz: new SequenceExpansion(['optionalIntroScreenText', 'questions']),
      optionalIntroScreenText: new RepeatExpansion(['introScreenText']),
      introScreenText: new MultiLineTextExpansion(),
      text: new MultiLineTextExpansion(),
      completion: new MultiLineTextExpansion(),
      introduction: new MultiLineTextExpansion(),
      video: new SequenceExpansion(['introScreenText', 'videoAsset']),
      videoAsset: new ImageTerm(),
      questions: new RepeatExpansion('question'),
      question: new AlternativesExpansion([
        'openQuestion',
        'multipleChoiceQuestion'
      ]),
      openQuestion: new SequenceExpansion(['questionPrompt', 'answer', 'feedback']),
      multipleChoiceQuestion: new SequenceExpansion(['questionPrompt', 'answerChoices']),
      answerChoices: new RepeatExpansion('answerOption'),
      answerOption: new SequenceExpansion(['answer', 'correctOrNot', 'feedback'])
    }
  ),
  firebaseForCourses,
  store
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
  const rootPath = [];
  return (
    <div>
      <Login login={props.login}/>
      <hr />
      <h1>Create or edit a document</h1>
      <h2>Existing documents</h2>
      <Listing listing={props.listing}/>
      <hr />
      <DocumentEditor element={props.documentEditor} path={rootPath} />
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
              onClick={(e) => {quizzes.load(doc.key)}}
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

const DocumentEditor = (props) => {
  if (props.element !== null) {
    return (
      <div>
        <h1>Edit your document here</h1>
        <button onClick={(e) => {store.dispatch({type:'SAVE_DOCUMENT'})}}>Save Document</button>
        <Field {...props} />
        <hr />
        <div>JSON Export</div>
        <pre>
          {JSON.stringify(props.element.objectForJson(),null,' ')}
        </pre>
      </div>
    );
  } else {
    return (
      <div>No Document Loaded</div>
    );
  }
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
    case 'MULTILINE_TEXT': return MultilineTextField(props);
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
      className='string-field'
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

const MultilineTextField = (props) => {
  return (
    <textarea
      className='multiline-text-field'
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
}

const render = () => {
  const props = {
    element: store.getState(),
    path: []
  }
  ReactDOM.render(
    <CMS
      {...store.getState()}
    />,
    document.getElementById('app'));
}

const listQuizzes = (callback) => {quizzes.list(callback)}

store.subscribe(render);
render();
