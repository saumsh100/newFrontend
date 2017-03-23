
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function BackgroundIcon(props) {
  const {
    icon,
    size,
    iconClassName,
    backgroundClassName,
    onClick,
  } = props;
  
  const fontAwesomeClass = `fa fa-${icon} ${styles.icon}`;
  const iconClasses = classNames(iconClassName, fontAwesomeClass, styles.icon);
  const bckGroundClasses = classNames(styles.bckGround, styles[backgroundClassName]);

  return (
    <div className={bckGroundClasses} >
      <i className={iconClasses} onClick={onClick} />
    </div> 
  );
}


BackgroundIcon.defaultProps = {
  size: 1
};
BackgroundIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
