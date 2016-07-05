import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { loop, Effects } from 'redux-loop';

export const login = (oldState = {loginStatus: 'NOT_LOGGED_IN', user: null, authMessage: ''}, action) => {
  switch (action.type) {
    case 'LOGGED_IN':
      return loop(
        {
          loginStatus: 'LOGGED_IN',
          user: action.user,
          authMessage: ''
        },
        Effects.constant({
            type: 'LIST_DOCUMENTS'
        })
      );
    case 'LOGGED_OUT':
      return {
        loginStatus: 'NOT_LOGGED_IN',
        user: null,
        authMessage: ''
      };
    case 'AUTH_ERROR':
      return {
        ...oldState,
        authMessage: action.message
      };
    default: return oldState;
  }
};

const LoginPresentational = (props) => {
  let emailField;
  let passwordField;
  if (props.login.loginStatus === 'LOGGED_IN') {
    return (
      <div>
        Logged in as {props.login.user.email}
        <button onClick={()=>props.logout()}>Logout</button>
      </div>
    );
  } else {
    return (
      <div>
        <p>Please Login</p>
        <label>Email:
          <input type="text" ref={node => {emailField = node;}}/>
        </label>
        <label>Password:
          <input type="password" ref={node => {passwordField = node;}}/>
        </label>
        <div>
          <button onClick={
            () => {
              props.doLogin(emailField.value, passwordField.value);
              emailField.value = '';
              passwordField.value = '';
            }
          }>
            Login
          </button>
        </div>
      </div>
    );
  }
};
LoginPresentational.propTypes = {
  login: PropTypes.shape({
      loginStatus: PropTypes.string.isRequired,
      user: PropTypes.object
  }),
  doLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    login: state.login
});

export const Login = connect(mapStateToProps)(LoginPresentational);
