var _testCases = [];

export const testCase = (name, testFunc) => {
  _testCases.push({
    name: name,
    testFunc: testFunc
  });
}

export const runAll = () => {
  for (const test of _testCases) {
    const {
      name,
      testFunc
    } = test;
    console.log('running test case: ' + name);
    try {
      testFunc();
      console.log('completed test case: ' + name);
    } catch (err) {
      console.log('test case:' + name + ' failed:');
      console.log(err);
    }
  }
}

window.onload = runAll;
