
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import RangeSlider from '../../RangeSlider';

export default function RFRangeSlider(props) {
  const {
    input,
    error,
    meta,
  } = props;

  const {
    value,
  } = input;
  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const newProps = omit(props, ['input', 'meta']);
  const newInput = omit(input, ['value', 'onChange']);
  
  return (
    <RangeSlider
      {...newProps}
      {...newInput}
      error={finalError}
      onChange={(value)=>{input.onChange(value)}}
      setRangeState={input.value}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFRangeSlider.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
