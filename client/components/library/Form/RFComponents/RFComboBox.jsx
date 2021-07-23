/* eslint-disable react/prop-types */
import React from 'react';
import ComboBoxComponent from '../../ComboBox';

const ComboBox = ({ input, ...rest }) => (
  <ComboBoxComponent
    onChange={(opt) => {
      input.onChange(opt.value);
    }}
    {...rest}
  />
);

export default ComboBox;
