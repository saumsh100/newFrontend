
import PropTypes from 'prop-types';
import React from 'react';
import Select from '../../Select';

export default function RFSelect(props) {
  const {
    input, icon, label, error, meta,
  } = props;

  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const finalIcon = asyncValidating ? (
    <i className="fa fa-cog fa-spin fa-fw" />
  ) : (
    icon
  );

  return (
    <Select
      {...props}
      {...input}
      label={label}
      error={finalError}
      icon={finalIcon}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFSelect.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
};
