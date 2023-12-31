
import PropTypes from 'prop-types';
import React, { Component, defaultProps } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import Avatar from '../Avatar';

export default function CheckboxImage(props) {
  const {
    id, label, checked, onChange, imgColor, url, firstName,
  } = props;

  let bgColor = '';

  if (checked && imgColor) {
    bgColor = imgColor;
  }

  return (
    <div className={styles.checkBoxImage}>
      <input type="checkbox" checked={checked} id={id} onChange={onChange} />
      <label className={styles.checkBoxImage__label} htmlFor={id}>
        <li className={styles.checkBoxImage__list}>
          <Avatar
            className={styles.checkBoxImage__avatar}
            user={{ avatarUrl: url, firstName }}
            size="sm"
            bgColor={bgColor}
          />
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
