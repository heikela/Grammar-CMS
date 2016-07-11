import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import { addListener, STARTING_TEST_RUN, INITIATING_TEST, TEST_PASSED, TEST_FAILED } from './trivialRunner';

const updateTestStatus = (testList, testName, newStatus, err = '') => {
  return testList.map((test) => {
      if (test.name === testName) {
        return {
          name: test.name,
          status: newStatus,
          err: err
        };
      } else {
        return test;
      }
    }
  );
};

const reportingStore = (state = {tests: []}, action) => {
  switch (action.type) {
    case STARTING_TEST_RUN: return {
      startTime: new Date(),
      tests: action.testNames.map((testName) => (
          {
            name: testName,
            status: 'NOT_RUN'
          }
        )
      )
    };
    case INITIATING_TEST: return {
      startTime: state.startTime,
      tests: updateTestStatus(state.tests, action.name, 'RUNNING')
    };
    case TEST_PASSED: return {
      startTime: state.startTime,
      tests: updateTestStatus(state.tests, action.name, 'TEST_PASSED')
    };
    case TEST_FAILED: return {
      startTime: state.startTime,
      tests: updateTestStatus(state.tests, action.name, 'TEST_FAILED', action.err.message)
    };
    default: return state;
  }
};

const store = createStore(reportingStore, undefined,
  window.devToolsExtension && window.devToolsExtension()
);

const statusTextColor = (status) => {
  switch (status) {
    case 'TEST_PASSED': return 'lime';
    case 'TEST_FAILED': return 'red';
    default: return 'black';
  }
};

const StatusText = (props) => {
  const color = statusTextColor(props.status);
  return <span style={{color: color}}>{props.status}</span>;
};
StatusText.propTypes = {
  status: PropTypes.string.isRequired
};

export const TestReport = (props) => {
  return (
    <div>
      <h1>Test Results</h1>
      <p>Test run started at: {props.startTime.toString()}</p>
      {props.tests.map((test) => {
        const failure = test.err ? test.err : '';
        return (
          <ul key={test.name}>{test.name} - <StatusText status={test.status}/> {failure}
          </ul>
        );
      })}
    </div>
  );
};
TestReport.propTypes = {
  tests: PropTypes.array.isRequired,
  startTime: PropTypes.object.isRequired
};

const render = () => {
  const props = store.getState();
  ReactDOM.render(
    <TestReport
      {...props}
    />,
    document.getElementById('testResults'));
};

store.subscribe(render);

addListener(store.dispatch);
