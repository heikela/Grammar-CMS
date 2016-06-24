import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';

import { addListener, STARTING_TEST_RUN, INITIATING_TEST, TEST_PASSED, TEST_FAILED } from './trivialRunner';

const updateTestStatus = (testList, testName, newStatus) => {
  return testList.map((test) => {
      if (test.name == testName) {
        return {
          name: test.name,
          status: newStatus
        }
      } else {
        return test;
      }
    }
  );
}

const reportingStore = (state = {tests: []}, action) => {
  switch (action.type) {
    case STARTING_TEST_RUN: return {
      tests: action.testNames.map((testName) => (
          {
            name: testName,
            status: 'NOT_RUN'
          }
        )
      )
    };
    case INITIATING_TEST: return {
      tests: updateTestStatus(state.tests, action.name, 'RUNNING')
    };
    case TEST_PASSED: return {
      tests: updateTestStatus(state.tests, action.name, 'TEST_PASSED')
    };
    case TEST_FAILED: return {
      tests: updateTestStatus(state.tests, action.name, 'TEST_FAILED')
    };
    default: return state;
  }
};

const store = createStore(reportingStore, undefined,
  window.devToolsExtension && window.devToolsExtension()
);

export const TestReport = (props) => {
  return (
    <div>
      <h1>Test Results</h1>
      {props.tests.map((test) => {
        return (
          <ul key={test.name}>{test.name} - {test.status}</ul>
        );
      })}
    </div>
  );
}

const render = () => {
  const props = store.getState();
  ReactDOM.render(
    <TestReport
      {...props}
    />,
    document.getElementById('testResults'));
}

store.subscribe(render);

addListener(store.dispatch);
