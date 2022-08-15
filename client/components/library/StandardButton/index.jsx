/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

function Button(props) {
  const {
    className,
    disabled = false,
    icon,
    children,
    title,
    iconRight,
    variant = 'primary',
    onClick,
    type = 'button',
    iconType = 'solid',
  } = props;

  const typeMap = {
    light: 'fal',
    solid: 'fas',
    regular: 'far',
    brand: 'fab',
  };

  const handleClick = () => (disabled ? null : onClick());

  return (
    <button
      type={type}
      disabled={disabled}
      className={classNames(className, {
        [styles.disabled]: disabled,
        [styles[variant]]: !disabled,
      })}
      onClick={handleClick}
    >
      {icon && <i className={`${typeMap[iconType]} fa-${icon} ${styles.icon} `} />}

      {children || (title && <span className={styles.text}>{children || title}</span>)}

      {iconRight && <i className={`${typeMap[iconType]} fa-${iconRight} ${styles.iconRight}`} />}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success']),
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  iconType: PropTypes.oneOf(['light', 'solid', 'regular', 'brand']),
};

Button.defaultProps = {
  children: null,
  className: '',
  icon: '',
  iconRight: '',
  title: '',
  disabled: false,
  variant: 'primary',
  type: 'button',
  iconType: 'solid',
};

export default Button;
