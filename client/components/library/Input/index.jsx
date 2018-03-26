
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import styles from './styles.scss';
import Icon from '../Icon';
import withTheme from '../../../hocs/withTheme';

function Input(props) {
  const {
    label,
    value,
    error,
    icon,
    IconComponent,
    type = 'text',
    theme,
    classStyles,
    iconType,
  } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat input)

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles', 'IconComponent', 'iconType', 'refCallBack']);
  const inputStyle = theme;
  const valuePresent = value !== null && value !== undefined && value !== '' &&
    !(typeof value === 'number' && isNaN(value));

  let labelClassName = inputStyle.label;
  let iconClassName = inputStyle.icon;

  if (valuePresent) {
    labelClassName = classNames(labelClassName, inputStyle.filled);
    iconClassName = classNames(inputStyle.hidden, iconClassName);
  }

  let inputClassName = inputStyle.input;

  if (error) {
    labelClassName = classNames(inputStyle.erroredLabel, labelClassName);
    inputClassName = classNames(inputStyle.erroredInput, inputClassName);
    iconClassName = classNames(inputStyle.erroredIcon, iconClassName);
  }

  const errorClassName = inputStyle.error;

  const errorComponent = error ? <span className={errorClassName}>{error}</span> : null;

  let iconComponent = null;
  // TODO: fix this so that it does not throw an error!
  /* if (IconComponent) {
    iconComponent = <IconComponent className={iconClassName} />;
  } else */

  if (icon) {
    iconComponent = <Icon className={iconClassName} type={iconType} icon={icon} />;
  }
  // TODO: use classNames to avoid "undefined" being a className
  return (
    <div className={`${inputStyle.group} ${classStyles}`}>
      <input type={type} className={inputClassName} {...inputProps} ref={props.refCallBack} />
      <span className={inputStyle.bar} />
      <label className={labelClassName}>{label}</label>
      {errorComponent}
      {iconComponent}
    </div>
  );
}

Input.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  theme: PropTypes.object,
  type: PropTypes.string,
  icon: PropTypes.string,
  IconComponent: PropTypes.func,
};

export default withTheme(Input, styles);
