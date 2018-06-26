
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckboxButton from '../../CheckboxButton';

export default function RFCheckboxButton(props) {
  const {
    input, icon, label, error, meta, flipped,
  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const finalIcon = asyncValidating ? (
    <i className="fa fa-cog fa-spin fa-fw" />
  ) : (
    icon
  );
  const checked = flipped ? !input.value : input.value;

  return (
    <CheckboxButton
      {...props}
      {...input}
      checked={checked}
      label={label}
      error={finalError}
      icon={finalIcon}
      onChange={e => input.onChange(!input.value)}
    />
  );
}

RFCheckboxButton.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
  flipped: PropTypes.bool,
};
