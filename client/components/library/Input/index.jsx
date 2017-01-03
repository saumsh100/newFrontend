
import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function Input(props) {
  const {
    label,
  } = props;
  
  // TODO: add support for error attribute
  
  return (
    <div className={styles.group}>
      <input className={styles.input} type="text" required {...props} />
      <span className={styles.bar} />
      <label className={styles.label}>
        {label}
      </label>
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
};
