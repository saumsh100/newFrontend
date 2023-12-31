/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

function Button(props) {
  const {
    className,
    disabled = false,
    disableVariant = 'disabled',
    icon,
    children,
    title,
    iconRight,
    variant = 'primary',
    onClick,
    type = 'button',
    iconType = 'solid',
    onMouseEnter,
    onMouseLeave,
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
        [styles[disableVariant]]: disabled,
        [styles[variant]]: !disabled,
      })}
      onClick={handleClick}
      onMouseOver={onMouseEnter}
      onFocus={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={onMouseLeave}
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'destructive']),
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  iconType: PropTypes.oneOf(['light', 'solid', 'regular', 'brand']),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  disableVariant: PropTypes.string,
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
  disableVariant: 'disabled',
  onMouseEnter: () => {},
  onMouseLeave: () => {},
};

export default Button;
