
import PropTypes from 'prop-types';
import React from 'react';
import DayPickerWithHelper from '../../DayPicker/DayPickerWithHelper';

const RDayPickerWithHelpers = ({ input, error, meta, ...props }) => {
  const { touched, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);

  return <DayPickerWithHelper {...props} {...input} error={finalError} />;
};

export default RDayPickerWithHelpers;

RDayPickerWithHelpers.defaultProps = {
  error: '',
};
RDayPickerWithHelpers.propTypes = {
  input: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]))
    .isRequired,
  meta: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.func]))
    .isRequired,
  error: PropTypes.string,
};
