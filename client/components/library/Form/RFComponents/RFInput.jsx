
import PropTypes from 'prop-types';
import React from 'react';
import { normalizePhone } from '../../../../util/isomorphic';
import Icon from '../../Icon';
import Input from '../../Input';
import { inputShape, metaShape } from '../../PropTypeShapes/inputShape';

export default function RFInput({
  input,
  icon,
  label,
  type,
  error,
  meta,
  theme,
  iconComponent,
  ...props
}) {
  const inputProps = {
    ...input,
    value: type === 'tel' ? normalizePhone(input.value) : input.value,
  };
  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const IconComponent = iconComponent
    || (asyncValidating && (
      <Icon
        pulse
        className={theme && theme.iconClassName}
        icon="spinner"
        type="regular"
        {...props}
      />
    ));
  return (
    <Input
      theme={theme}
      type={type}
      label={label}
      error={finalError}
      iconComponent={IconComponent}
      icon={icon}
      {...inputProps}
      {...props}
    />
  );
}

RFInput.propTypes = {
  theme: PropTypes.objectOf(PropTypes.string),
  input: PropTypes.shape(inputShape).isRequired,
  meta: PropTypes.shape(metaShape),
  icon: PropTypes.node,
  iconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.string,
};

RFInput.defaultProps = {
  theme: {},
  meta: {},
  icon: undefined,
  iconComponent: null,
  label: undefined,
  type: 'text',
  error: undefined,
};
