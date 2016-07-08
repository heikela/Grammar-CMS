import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const GameLauncherPresentational = (props) => {
  return (
    <button
      onClick={() => props.startGame(props.rulesBeingEdited)}
    >
      Start a game based on the rules being edited
    </button>
  );
};
GameLauncherPresentational.propTypes = {
  startGame: PropTypes.func.isRequired,
  rulesBeingEdited: PropTypes.object
};
const mapStateToProps = (state) => (
  {
    rulesBeingEdited: state.documentEditor
  }
);
const mapDispatchToProps = (dispatch) => (
  {
    startGame: (rules) => dispatch(
      {
        type: 'START_GAME',
        rules: rules.objectForJson()
      }
    )
  }
);
export const GameLauncher = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameLauncherPresentational);
