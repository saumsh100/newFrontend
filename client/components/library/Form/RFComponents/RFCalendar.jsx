import React, { PropTypes } from 'react';
import Calendar from '../../Calendar';


export default function RFCalendar(props) {
  const {
    input,
    error,
    meta,
  } = props;

  return (
    <Calendar
      {...props}
      {...input}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFCalendar.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
