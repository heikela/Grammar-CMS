import React, { PropTypes } from 'react';

export const TextInput = (props) => (
  <input
    type='text'
    onChange={
      (e) => {
        props.onChange(e.target.value);
      }
    }
    value={props.value}
  />
);
TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
