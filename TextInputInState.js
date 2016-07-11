import { PropTypes } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { TextInput } from './TextInput';

export const textInputInState = (oldState, action) => {
  switch (action.type) {
    case 'TEXT_INPUT_ONCHANGE':
      return oldState.setIn(action.path, action.value);
    default:
      return oldState;
  }
};

const mapStateToProps = (state, ownProps) => ({
    value: state.game.getIn(ownProps.path)
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (value) => {
      dispatch({
          type: 'TEXT_INPUT_ONCHANGE',
          path: ownProps.path,
          value: value
      });
    }
  };
};

export const TextInputInState = connect(mapStateToProps, mapDispatchToProps)(TextInput);
TextInputInState.propTypes = {
  path: PropTypes.instanceOf(List).isRequired
};
