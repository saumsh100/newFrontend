
import React, { PropTypes } from 'react';
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
    type = 'text',
    theme,
    classStyles,
  } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat input)

  const inputProps = omit(props, ['error', 'borderColor', 'theme', 'classStyles']);
  const inputStyle = theme;

  const valuePresent = value !== null && value !== undefined && value !== '' &&
    !(typeof value === 'number' && isNaN(value));

  let labelClassName = inputStyle.label;
  if (valuePresent) {
    labelClassName = classNames(inputStyle.filled, labelClassName);
  }

  let inputClassName = inputStyle.input;
  let iconClassName = inputStyle.icon;

  if (error) {
    labelClassName = classNames(inputStyle.erroredLabel, labelClassName);
    inputClassName = classNames(inputStyle.erroredInput, inputClassName);
    iconClassName = classNames(inputStyle.erroredIcon, iconClassName);
  }

  const errorClassName = inputStyle.error;

  const errorComponent = error ? <span className={errorClassName}>{error}</span> : null;

  return (
    <div className={`${inputStyle.group} ${classStyles}`}>
      <input type={type} className={inputClassName} {...inputProps} ref={inputProps.refCallBack} />
      <span className={inputStyle.bar} />
      <label className={labelClassName}>
        {label}
      </label>
      {errorComponent}
      {icon ? <Icon className={iconClassName} icon={icon} /> : null }
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
};

export default withTheme(Input, styles);
