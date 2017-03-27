
import React, { PropTypes } from 'react';
import Toggle from '../../Toggle';

export default function RFToggle(props) {
  const {
    input,
    flipped,
    label,
    error,
    meta,
    checked,
  } = props;

  const newProps = Object.assign({} , props, { defaultChecked: input.value });
  let showComponent = null;
  if(checked != null) {
    showComponent = (
      <Toggle
        checked={checked}
        onChange={e => input.onChange(flipped ? !e.target.checked : e.target.checked)}
      />
    )
  } else {
    showComponent = (
      <Toggle
        defaultChecked={flipped ? !input.value : input.value}
        onChange={e => input.onChange(flipped ? !e.target.checked : e.target.checked)}
      />
    )
  }

  return (
    <div>
      {showComponent}
    </div>
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
