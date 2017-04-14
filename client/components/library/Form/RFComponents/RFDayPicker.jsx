import React, { PropTypes } from 'react';
import DayPicker from '../../DayPicker';

export default function RFDayPicker(props) {
  const {
    input,
    error,
    meta,
  } = props;

  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);

  return (
    <DayPicker
      {...props}
      {...input}
      error={finalError}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFDayPicker.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
