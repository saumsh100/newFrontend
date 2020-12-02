
import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';
import DayPicker from '../../DayPicker';

export default function RFDayPicker(props) {
  const { input, error, meta } = props;

  const { touched, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const newProps = omit(props, ['input', 'meta']);

  return <DayPicker {...newProps} {...input} error={finalError} />;
}

RFDayPicker.defaultProps = {
  error: '',
};
RFDayPicker.propTypes = {
  input: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]))
    .isRequired,
  meta: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]))
    .isRequired,
  error: PropTypes.string,
};
