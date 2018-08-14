
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import omit from 'lodash/omit';
import DayPicker from '../../DayPicker';

export default function RFDayPicker(props) {
  const { input, error, meta } = props;

  const { touched, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const newProps = omit(props, ['input', 'meta']);

  return <DayPicker {...newProps} {...input} error={finalError} />;
}

/* eslint react/forbid-prop-types: 0 */
RFDayPicker.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  error: PropTypes.string,
};
