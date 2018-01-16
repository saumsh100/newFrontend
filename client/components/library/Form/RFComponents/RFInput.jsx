
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import Input from '../../Input';
import Icon from '../../Icon';

export default function RFInput(props) {
  const {
    input,
    icon,
    label,
    type,
    error,
    meta,
    pattern,
  } = props;

  const newProps = omit(props, ['input', 'meta',]);
  const { touched, asyncValidating, dirty } = meta;

  const finalError = error || ((touched || dirty) ? meta.error : null);
  const IconComponent = asyncValidating ?
    (props) => <Icon {...props} icon="spinner" pulse /> :
    null;

  return (
    <Input
      {...newProps}
      {...input}
      type={type}
      label={label}
      error={finalError}
      IconComponent={IconComponent}
      icon={icon}
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
  error: PropTypes.func,
};
