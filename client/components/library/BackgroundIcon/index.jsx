
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function BackgroundIcon(props) {
  const {
    icon,
    size,
    iconClassName,
    color,
    fontSize,
    onClick,
    className,
  } = props;

  const fontAwesomeClass = `fa fa-${icon} ${styles.icon}`;
  const iconClasses = classNames(iconClassName, fontAwesomeClass, styles.icon);
  const bckGroundClasses = classNames(styles.bckGround, className);

  return (
    <div
      className={bckGroundClasses}
      style={{
        background: color,
        width: `${fontSize}rem`,
        height: `${fontSize}rem`,
      }}
    >
      <i
        style={{ fontSize: `${fontSize / 2}rem` }}
        className={iconClasses}
        onClick={onClick}
      />
    </div>
  );
}

BackgroundIcon.defaultProps = {
  size: 1,
};
BackgroundIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
