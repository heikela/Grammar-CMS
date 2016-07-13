import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Signup } from './Signup';
import { textInputInState } from './TextInputInState';

import { Map } from 'immutable';
import { reduceReducers } from './redux-util';

import { setupPlayers } from './GameUtil';

const initialState = Map({
    stage: 'EMPTY',
    activeGameRules: null
});

const gameReducer = (oldState = initialState, action) => {
  switch (action.type) {
    case 'START_GAME':
      return oldState.merge({
        stage: 'SIGNUP',
        activeGameRules: action.rules,
        players: setupPlayers(action.rules)
      });
    case 'FINISH_SIGNUP':
      return oldState.merge({
        stage: 'PLAYING'
      });
    default: return oldState;
  }
};
export const game = reduceReducers([textInputInState, gameReducer]);

const GamePresentational = (props) => {
  switch (props.stage) {
    case 'EMPTY': return (
        <div>
          No game selected
        </div>
      );
    case 'SIGNUP': return (
        <div>
          Signing up players for a game of {props.game.getIn(['activeGameRules', 'title'])}
          {props.game.get('players').map((player) => {
            return <Signup key={player.get('id')} playerId={player.get('id')} />;
          }).toArray()}
          <button onClick={props.finishSignup}>Start</button>
        </div>
      );
    case 'PLAYING': return (
        <div>
          Game of {props.game.getIn(['activeGameRules', 'title'])} ongoing.
          Players:
          {props.game.get('players').map((player) => {
            return <div key={player.get('id')}>{player.get('designation')}: {player.get('name')}</div>;
          })}
        </div>
      );
    default: return <div>Unknown game state</div>;
  }
};
GamePresentational.propTypes = {
  stage: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  finishSignup: PropTypes.func
};
const mapStateToProps = (state) => (
  {
    stage: state.game.get('stage'),
    game: state.game
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    finishSignup: () => dispatch({type: 'FINISH_SIGNUP'})
  }
);

export const Game = connect(mapStateToProps, mapDispatchToProps)(GamePresentational);
