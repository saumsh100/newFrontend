
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import RangeSlider from '../../RangeSlider';
import Input from '../../Input';

export default function RFRangeSlider(props) {
  const {
    input,
    error,
    meta,
    defaultValues,
  } = props;

  const {
    value,
  } = input;
  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const newProps = omit(props, ['input', 'meta']);
  const newInput = omit(input, ['value', 'onChange']);

  const initialState = input.value ? input.value : defaultValues;

  return (
    <RangeSlider
      value={initialState}
      {...newProps}
      {...newInput}
      error={finalError}
      onChange={(value)=>{ input.onChange(value) }}
      setRangeState={initialState}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFRangeSlider.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
