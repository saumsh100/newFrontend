
import React, { PropTypes } from 'react';
import omit from 'lodash/omit';
import Icon from '../../Icon';
import Input from '../../Input';
import { inputShape, metaShape } from '../../PropTypeShapes/inputShape';

export default function RFInput(props) {
  const { input, icon, label, type, error, meta, theme, iconComponent } = props;
  const newProps = omit(props, ['input', 'meta']);
  const { touched, asyncValidating, dirty } = meta;
  const finalError = error || (touched || dirty ? meta.error : null);
  const IconComponent =
    iconComponent ||
    (asyncValidating && (
      <Icon
        {...props}
        className={theme && theme.iconClassName}
        icon="spinner"
        type="regular"
        pulse
      />
    ));
  return (
    <Input
      {...newProps}
      {...input}
      type={type}
      label={label}
      error={finalError}
      iconComponent={IconComponent}
      icon={icon}
    />
  );
}

RFInput.propTypes = {
  theme: PropTypes.objectOf(PropTypes.string),
  input: PropTypes.shape(inputShape),
  meta: PropTypes.shape(metaShape),
  icon: PropTypes.node,
  iconComponent: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.string,
  error: PropTypes.func,
};
