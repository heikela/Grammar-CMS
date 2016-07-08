import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export const game = (oldState = {}, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...oldState,
        activeGameRules: action.rules
      };
    default: return oldState;
  }
};

const GamePresentational = (props) => {
  if (props.rules) {
    return (
      <div>
        Playing a game of {props.rules.title}
      </div>
    );
  } else {
    return (
      <div>
        No game selected
      </div>
    );
  }
};
GamePresentational.propTypes = {
  rules: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
};
const mapStateToProps = (state) => (
  {
    rules: state.game.activeGameRules
  }
);

export const Game = connect(mapStateToProps)(GamePresentational);
