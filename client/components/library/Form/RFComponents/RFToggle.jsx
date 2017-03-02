
import React, { PropTypes } from 'react';
import Toggle from '../../Toggle';

export default function RFToggle(props) {
  const {
    input,
    flipped,
    label,
    error,
    meta,
  } = props;

  const newProps = Object.assign({} , props, { defaultChecked: input.value });

  return (
    <Toggle
      defaultChecked={flipped ? !input.value : input.value}
      onChange={e => input.onChange(flipped ? !e.target.checked : e.target.checked)}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
Toggle.propTypes = {
  toggle: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.string,
};
