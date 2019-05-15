
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';

const Radio = ({ label, value, onChange, checked, disabled, ...props }) => {
  const onKeyDown = (e) => {
    if (!disabled && (e.keyCode === 13 || e.keyCode === 32)) {
      onChange(value);
    }
  };
  return (
    <label
      className={classnames(styles.wrapper, {
        [styles.checked]: checked,
        [styles.disabled]: disabled,
      })}
      role="button"
      tabIndex="0"
      htmlFor={value}
      onClick={() => !disabled && onChange(value)}
      onChange={() => !disabled && onChange(value)}
      onKeyDown={onKeyDown}
      {...props}
    >
      <div className={classnames(styles.input, { [styles.checked]: checked })}>
        <input
          id={value}
          type="radio"
          checked={checked}
          value={value}
          className={styles.hidden}
          onChange={() => {}}
        />
      </div>
      <div className={styles.label}>{label}</div>
    </label>
  );
};

Radio.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

Radio.defaultProps = {
  disabled: false,
  onChange: () => {},
  checked: false,
  label: '',
};

export default Radio;
