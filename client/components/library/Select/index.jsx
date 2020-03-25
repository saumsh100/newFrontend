
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Select(props) {
  const { children, value, error, icon, min } = props;

  // TODO: add support for hint attribute
  // TODO: its like a label except it doesn't go ontop (think Chat Select)
  const valuePresent =
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !(typeof value === 'number' && isNaN(value));

  // Without this the label would fall back onBlur
  let labelClassName = styles.label;
  if (valuePresent) {
    labelClassName = classNames(styles.filled, labelClassName);
  }

  let selectClassName = styles.Select;
  if (error) {
    labelClassName = classNames(styles.erroredLabel, labelClassName);
    selectClassName = classNames(styles.erroredSelect, selectClassName);
  }

  const errorComponent = error ? <span className={styles.error}>{error}</span> : null;

  return min ? (
    <select className={selectClassName} {...props}>
      {children}
    </select>
  ) : null;
}
Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
