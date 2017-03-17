
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import styles from './styles.scss';

export default function Input(props) {
  const { label, value, error, icon, type, min } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat input)

  const inputProps = omit(props, ['error'])

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

  // const errorComponent = error ? <span className={styles.error}>{error}</span> : null;

  const content = min ?
    <input type={type || "text"} className={inputClassName} {...inputProps} ref={(input) => { if (inputProps.refCallback) inputProps.refCallback(input) } } />
    :
    <div className={styles.group}>
      <input type={type || "text"} className={inputClassName} {...inputProps} />
      <span className={styles.bar} />
      <label className={labelClassName}>
        {error ? error : label}
      </label>
      {/*{errorComponent}*/}
    </div>;
  return content;
};

Input.propTypes = {
  error: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};
