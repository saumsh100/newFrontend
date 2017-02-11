
import React, { PropTypes } from 'react';
import Input from '../../Input';

export default function RFInput(props) {
  const {
    input,
    icon,
    label,
    type,
    error,
    meta,

  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || ((touched || dirty) ? meta.error : null);
  const finalIcon = asyncValidating ? (<i className={'fa fa-cog fa-spin fa-fw'} />) : icon;

  return (
    <Input
      {...props}
      {...input}
      type={type}
      label={label}
      error={finalError}
      icon={finalIcon}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFInput.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.string,
};
