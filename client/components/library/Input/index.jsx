
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import styles from './styles.scss';
import Icon from '../Icon';

export default function Input(props) {
  const {
    label,
    value,
    error,
    icon,
    IconComponent,
    type = 'text',
    min,
    borderColor,
    theme,
    classStyles,
  } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat input)

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles', 'IconComponent']);

  const valuePresent = value !== null && value !== undefined && value !== '' &&
    !(typeof value === 'number' && isNaN(value));

  // Without this the label would fall back onBlur
  let labelClassName = styles.label;
  if (valuePresent) {
    labelClassName = classNames(styles.filled, labelClassName);
  }

  let inputClassName = styles.input;
  if (error) {
    labelClassName = classNames(styles.erroredLabel, labelClassName);
    inputClassName = classNames(styles.erroredInput, inputClassName);
  }

  if (borderColor) {
    inputClassName = classNames(styles[`${borderColor}Border`], inputClassName);
  }

  let iconClassName = styles.icon;

  if (theme) {
    labelClassName = classNames(styles[`theme_${theme}Label`], labelClassName);
    inputClassName = classNames(styles[`theme_${theme}Input`], inputClassName);
    iconClassName = classNames(styles[`theme_${theme}Icon`], iconClassName);
  }

  const errorComponent = error ? <span className={styles.error}>{error}</span> : null;

  let iconComponent = null;
  // TODO: fix this so that it does not throw an error!
  /*if (IconComponent) {
    iconComponent = <IconComponent className={iconClassName} />;
  } else if (icon) {
    iconComponent = <Icon className={iconClassName} icon={icon} />;
  }*/

  // TODO: use classNames to avoid "undefined" being a className
  return (
    <div className={`${styles.group} ${classStyles}`}>
      <input type={type} className={inputClassName} {...inputProps} />
      <span className={styles.bar} />
      <label className={labelClassName}>
        {label}
      </label>
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

  type: PropTypes.string,
  icon: PropTypes.string,
  IconComponent: PropTypes.func,
};
