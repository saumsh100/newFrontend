
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Icon(props) {
  const {
    name,
    size = 1,
    className,
  } = props;
  
  const fontAwesomeClass = `fa fa-${name}`;
  const classes = classNames(className, fontAwesomeClass);
  
  return <i style={{ fontSize: `${size} em` }} className={classes} ariaHidden="true" />;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};
