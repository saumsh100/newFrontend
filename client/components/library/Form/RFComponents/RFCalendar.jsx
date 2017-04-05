import React, { PropTypes } from 'react';
import Calendar from '../../Calendar';
import Input from '../../Input';

export default function RFCalendar(props) {
  const {
    input,
    error,
    meta,
  } = props;

  return (
    <div>
      <Input
        {...props}
        {...input}
      />
      <Calendar
        {...props}
        {...input}
      />
    </div>
  );
}

/* eslint react/forbid-prop-types: 0 */
RFCalendar.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
