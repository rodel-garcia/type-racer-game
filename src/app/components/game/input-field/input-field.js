import React from 'react';
import './input-field.module.scss';

const InputField = ({ value, onChangeHandler }) => {
  return (
    <textarea
      onKeyPress={onChangeHandler}
      onChange={() => {}}
      autoFocus
      rows='7'
      placeholder='Start typing here!'
      value={value}
    ></textarea>
  );
};

export default InputField;
