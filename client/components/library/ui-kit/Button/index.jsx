
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ label, children, onClick, className, type, disabled }) => (
  <button type={type} onClick={onClick} className={className} disabled={disabled}>
    {label || children}
  </button>
);

Button.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

Button.defaultProps = {
  label: '',
  children: null,
  disabled: false,
  className: null,
  type: 'button',
};

export default Button;
