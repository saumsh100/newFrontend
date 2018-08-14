
import PropTypes from 'prop-types';
import React from 'react';
import Toggle from '../../Toggle';

export default function RFToggle(props) {
  const {
    input,
    flipped,
    label,
    className,
    error,
    meta,
    checked,
    theme,
  } = props;

  return (
    <Toggle
      label={label}
      className={className}
      checked={flipped ? !input.value : input.value}
      onChange={e =>
        input.onChange(flipped ? !e.target.checked : e.target.checked)
      }
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFToggle.propTypes = {
  toggle: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.string,
};
