import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const initialState = {
  stage: 'EMPTY',
  activeGameRules: null
};

export const game = (oldState = initialState, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...oldState,
        stage: 'SIGNUP',
        activeGameRules: action.rules
      };
    default: return oldState;
  }
};

const GamePresentational = (props) => {
  switch (props.stage) {
    case 'EMPTY': return (
        <div>
          No game selected
        </div>
      );
    case 'SIGNUP': return (
        <div>
          Signing up players for a game of {props.rules.title}
        </div>
      );
    default: return <div>Unknown game state</div>;
  }
};
GamePresentational.propTypes = {
  stage: PropTypes.string.isRequired,
  rules: PropTypes.shape({
    title: PropTypes.string.isRequired
  })
};
const mapStateToProps = (state) => (
  {
    stage: state.game.stage,
    rules: state.game.activeGameRules
  }
);

export const Game = connect(mapStateToProps)(GamePresentational);
