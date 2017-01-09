
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Input(props) {
  const {
    label,
    value,
    error,
    icon,
  } = props;
  
  // TODO: add support for error attribute
  
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
  
  const errorComponent = error ? <span className={styles.error}>{error}</span> : null;
  
  return (
    <div className={styles.group}>
      <input type="text" className={inputClassName} {...props} />
      <span className={styles.bar} />
      <label className={labelClassName}>
        {label}
      </label>
      {errorComponent}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};
