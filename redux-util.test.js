import { testCase } from './trivialRunner';
import expect from 'expect';

import { applyReducers } from './redux-util';

testCase('testCombineTwoReducers', () => {
  const reducer1 = (state, action) => {
    if (action.type === 'FOO') {
      return {
        ...state,
        field1: 'FOO'
      };
    } else {
      return state;
    }
  };
  const reducer2 = (state, action) => {
    if (action.type === 'BAR') {
      return {
        ...state,
        field2: 'BAR'
      };
    } else {
      return state;
    }
  };
  const initialState = {
    field0: 'BAZ'
  };
  const reducers = [reducer1, reducer2];
  expect(
    applyReducers(
      reducers,
      applyReducers(reducers, initialState, {type: 'FOO'}),
      {type: 'BAR'}
    )
  ).toEqual(
    {
      field0: 'BAZ',
      field1: 'FOO',
      field2: 'BAR'
    }
  );
});
