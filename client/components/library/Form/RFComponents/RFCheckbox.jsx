
import React, { PropTypes } from 'react';
import Checkbox from '../../Checkbox';

export default function RFCheckbox(props) {
  const {
    input,
    icon,
    label,
    error,
    meta,
    flipped,
  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

  const checked = flipped ? !input.value : input.value;
  return (
    <Checkbox
      {...props}
      {...input}
      checked={checked}
      label={label}
      error={finalError}
      icon={finalIcon}
      onChange={e => input.onChange(flipped ? !e.target.checked : e.target.checked)}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFCheckbox.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
};
