
import React, { PropTypes, Component, defaultProps } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import Avatar from '../Avatar';

export default function CheckboxImage(props) {
  const {
    id,
    label,
    checked,
    onChange,
    imgColor,
    url,
    firstName,
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
          <Avatar className={imgStyle} user={{ avatarUrl: url, firstName }} size="lg" />
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
