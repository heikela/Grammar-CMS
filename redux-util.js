export const applyReducers = (reducers, oldState, action) => {
  // TODO style
  var state = oldState;
  for (var reducer of reducers) {
    state = reducer(state, action);
  }
  return state;
};

export const reduceReducers = (reducers) => (oldState, action) => applyReducers(reducers, oldState, action);
