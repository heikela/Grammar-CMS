export const initDocument = () => {
  return {
    type: 'SEQUENCE',
    keys: ['title', 'questions'],
    title: {
      type: 'STRING',
      value: '',
    },
    questions: {
      type: 'REPETITION',
      value: []
    }
  };
}

const stringPlaceholder = () => { return null; }

const createElement = () => {
  return {
    type: 'UNKNOWN'
  }
}

export const addToRepetition = (document, path) => {
  if (path.length === 0) {
    if (document.type === 'REPETITION') {
      return {
        ...document,
        value: [
          ...document.value,
          createElement()
        ]
      }
    } else {
      throw ('addToRepetition called for a non-sequence path');
    }
  } else {
    const currentKey = path[0];
    let affectedTree = {};
    affectedTree[currentKey] = addToRepetition(document[currentKey], path.slice(1));
    return {
      ...document,
      ...affectedTree
    }
  }
}

// Tests
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const testaddToRepetition = () => {
  const documentBefore = {
    type: 'SEQUENCE',
    title: {
        type: 'STRING',
        value: '',
    },
    questions: {
      type: 'REPETITION',
      value: []
    }
  };
  const documentAfter = {
    type: 'SEQUENCE',
    title: {
        type: 'STRING',
        value: '',
    },
    questions: {
      type: 'REPETITION',
      value: [
        {
          type: 'UNKNOWN'
        }
      ]
    }
  };
  deepFreeze(documentBefore);
  expect(
    addToRepetition(documentBefore, ['questions'])
  ).toEqual(documentAfter);
}
testaddToRepetition();

console.log('grammar tests pass');
