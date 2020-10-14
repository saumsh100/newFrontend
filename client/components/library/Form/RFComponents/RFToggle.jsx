
import PropTypes from 'prop-types';
import React from 'react';
import Toggle from '../../Toggle';

export default function RFToggle(props) {
  const { input, disabled, flipped, label, className } = props;

  return (
    <Toggle
      label={label}
      className={className}
      disabled={disabled}
      checked={flipped ? !input.value : input.value}
      onChange={e => input.onChange(flipped ? !e.target.checked : e.target.checked)}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFToggle.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node,
  flipped: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

RFToggle.defaultProps = {
  input: {
    value: null,
    onChange: () => {},
  },
  label: null,
  flipped: false,
  disabled: false,
  className: undefined,
};
