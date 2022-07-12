/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

const SwitchToggler = ({ onChange, leftLabel, rightLabel, checked }) => {
  const [isChecked, setIsChecked] = useState(checked);
  const handleChange = (value) => {
    if (value === isChecked) return;
    setIsChecked(value);
    onChange(value);
  };

  return (
    <div className={styles.switchToggler}>
      <button
        type="button"
        onClick={() => handleChange(true)}
        className={classNames(styles.switchToggler_left, {
          [styles.switchToggler_left_checked]: isChecked,
        })}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => handleChange(false)}
        className={classNames(styles.switchToggler_right, {
          [styles.switchToggler_right_checked]: !isChecked,
        })}
      >
        {rightLabel}
      </button>
      <div className={isChecked ? styles.slider_left : styles.slider_right} />
    </div>
  );
};

SwitchToggler.propTypes = {
  onChange: PropTypes.func.isRequired,
  leftLabel: PropTypes.string.isRequired,
  rightLabel: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default SwitchToggler;
