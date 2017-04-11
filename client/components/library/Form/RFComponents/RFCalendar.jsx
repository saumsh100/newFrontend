import React, { PropTypes } from 'react';
import Calendar from '../../Calendar';


export default function RFCalendar(props) {
  const {
    input,
    error,
    meta,
  } = props;

  const { touched, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);

  return (
    <Calendar
      {...props}
      {...input}
      error={finalError}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFCalendar.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
