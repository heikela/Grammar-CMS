var _testCases = [];
var _remainingTestsInActiveRun = [];
var _listeners = [];

export const testCase = (name, testFunc) => {
  _testCases.push({
    name: name,
    testFunc: testFunc
  });
}

export const INITIATING_TEST = 'INITIATING_TEST';
export const STARTING_TEST_RUN = 'STARTING_TEST_RUN';
export const TEST_PASSED = 'TEST_PASSED';
export const TEST_FAILED = 'TEST_FAILED';

const startingTest = ({name, testFunc}) => ({
    type: 'INITIATING_TEST',
    name: name
});

const pass = ({name, testFunc}) => ({
    type: 'TEST_PASSED',
    name: name
});

const failure = ({name, testFunc}, err) => ({
    type: 'TEST_FAILED',
    name: name,
    err: err
});

const startingRun = (testNames) => ({
    type: 'STARTING_TEST_RUN',
    testNames: testNames
});

const notifyListeners = (event) => {
  for (const listener of _listeners) {
    listener(event);
  }
}

const runNextTest = () => {
  const test = _remainingTestsInActiveRun.shift();
  const testFunc = test.testFunc;
  notifyListeners(startingTest(test));
  try {
    testFunc();
    notifyListeners(pass(test));
  } catch (err) {
    notifyListeners(failure(test, err));
  }
}

const runNextTestOrFinish = () => {
  if (_remainingTestsInActiveRun.length > 0) {
    runNextTest();
    continueTestRun();
  }
}

const continueTestRun = () => {
  window.setTimeout(runNextTestOrFinish, 0);
}

export const runAll = () => {
  notifyListeners(startingRun(_testCases.map((t) => t.name)));
  _remainingTestsInActiveRun = _testCases.slice(0);
  continueTestRun();
}

export const addListener = (listener) => {
  _listeners.push(listener)
}

window.onload = runAll;
