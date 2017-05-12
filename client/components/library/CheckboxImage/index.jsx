
import React, { PropTypes, Component, defaultProps } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function CheckboxImage(props) {
  const {
    id,
    label,
    checked,
    onChange,
    imgColor,
    imageSrc,
  } = props;

  let imgStyle = styles.checkBoxImage__photo;

  if (checked && imgColor) {
    imgStyle = classNames(styles[imgColor], imgStyle);
  } else if (checked && !imgColor) {
    imgStyle = classNames(styles.primaryColor, imgStyle);
  }

  return (
    <div className={styles.checkBoxImage}>
      <input
        type="checkbox" checked={checked} id={id}
        onChange={onChange}
      />
      <label className={styles.checkBoxImage__label} htmlFor={id}>
        <li className={styles.checkBoxImage__list}>
          <img className={imgStyle} src={imageSrc} />
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
