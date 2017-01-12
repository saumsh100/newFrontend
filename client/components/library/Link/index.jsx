
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link as RRLink } from 'react-router';
import styles from  './styles.scss';

export default function Link(props) {
  const {
    className,
  } = props;
  
  const classes = classNames(className, styles.link);
  return <RRLink {...props} className={classes} />;
}
