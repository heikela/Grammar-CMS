import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { TextInputInState } from './TextInputInState';

const SignupPresentational = (props) => (
  <div>
    Enter name for {props.playerDesignation}:
    <TextInputInState
      path={props.path.push('name')}
    />
  </div>
);
SignupPresentational.propTypes = {
  playerDesignation: PropTypes.string.isRequired,
  path: PropTypes.instanceOf(List).isRequired
};

const path = (ownProps, subPath = List()) => List(['players', ownProps.playerId + '']).concat(subPath);

const mapStateToProps = (state, ownProps) => ({
    playerDesignation: state.game.getIn(path(ownProps, List(['designation']))),
    path: path(ownProps)
});

export const Signup = connect(mapStateToProps)(SignupPresentational);
Signup.propTypes = {
  playerId: PropTypes.number.isRequired
};
