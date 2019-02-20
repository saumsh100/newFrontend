
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

function Button({ label, onClick, className, type, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(styles.button, className, { [styles.disabled]: disabled })}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  className: null,
  type: 'button',
};

export default Button;
