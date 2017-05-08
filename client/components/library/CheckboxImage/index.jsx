
import React, { PropTypes, Component, defaultProps } from 'react';
import styles from './styles.scss';

export default function CheckboxImage(props) {
  const {
    id,
    value,
    image,
    label,
    checked,
    onChange,
  } = props;

  return (
    <div className={styles.checkbox}>
      <input
        className={styles.filter_practitioner__checkbox}
        type="checkbox" checked={checked} id={id}
        onChange={onChange}
      />
      <label className={styles.filter_practitioner__label} htmlFor={id}>
        <li className={styles.filter_practitioner__item}>
          <img className={styles.filter_practitioner__photo} src="https://randomuser.me/api/portraits/men/44.jpg" alt="practitioner" />
          {label}
        </li>
      </label>
    </div>
  );
}

CheckboxImage.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.object,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};
