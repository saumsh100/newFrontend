
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Icon(props) {
  const {
    icon,
    size = 1,
    className,
  } = props;
  
  const fontAwesomeClass = `fa fa-${icon} ${styles.icon}`;
  const classes = classNames(className, fontAwesomeClass);
  
  return <i className={classes} style={{ fontSize: `${size} em` }} />;
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.number,
};
