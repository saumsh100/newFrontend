
import React, { PropTypes, Component, defaultProps } from 'react';
import styles from './styles.scss';

export default function Checkbox(props) {
  const {
    id,
    value,
    label,
    checked,
    onChange,
  } = props;

  return (
    <div className={styles.checkbox}>
      <input
        className={styles.checkbox__input}
        type="checkbox"
        id={id}
        checked={checked}
        value={value}
        onChange={() => {}}
      />
      <label
        htmlFor={id}
        className={styles.checkbox__label}
        onClick={onChange}
        onChange={onChange}
      >
        {label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};
