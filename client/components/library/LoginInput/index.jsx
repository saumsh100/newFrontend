import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import styles from './styles.scss';

const LoginInput = ({
  label,
  ariaLabel,
  value,
  onChange,
  name,
  type,
  submitFailed,
  className,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={className}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <div className={!submitFailed ? styles.inputContainer : styles.error}>
        <input
          className={styles.input}
          label={label}
          aria-label={ariaLabel}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type === 'password' && showPassword ? 'text' : type}
        />

        {type === 'password' &&
          (showPassword ? (
            <Icon icon="eye-slash" onClick={handleShowPassword} />
          ) : (
            <Icon icon="eye" onClick={handleShowPassword} />
          ))}
      </div>
    </div>
  );
};

LoginInput.defaultProps = {
  type: 'text',
  className: '',
  ariaLabel: '',
  name: '',
  submitFailed: false,
  placeholder: '',
};

LoginInput.propTypes = {
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  submitFailed: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default LoginInput;
