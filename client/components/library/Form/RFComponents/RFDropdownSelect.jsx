
import React, { PropTypes } from 'react';
import DropdownSelect from '../../DropdownSelect';

export default function RFDropdownSelect(props) {
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
    <DropdownSelect
      {...props}
      {...input}
      label={label}
      error={finalError}
      icon={finalIcon}
    />
  );
}

/* eslint react/forbid-prop-types: 0 */
RFDropdownSelect.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  icon: PropTypes.node,
  label: PropTypes.node,
  error: PropTypes.string,
};
