
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export function List(props) {
  const classes = classNames(props.className, styles.list);
  return <li {...props} className={classes} />;
}

export function ListItem(props) {
  const classes = classNames(props.className, styles.listItem);
  return <li {...props} className={classes} />;
}
