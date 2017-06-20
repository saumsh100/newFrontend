
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './styles.scss';
import Icon from '../Icon';
import withHoverable from '../../../hocs/withHoverable';

export function List(props) {
  const classes = classNames(props.className, styles.list);
  return <ul {...props} className={classes} />;
}

export function ListItem(props) {
  let classes = props.className;

  if (props.disabled) {
    classes = classNames(classes, styles.disabledListItem);
  } else {
    classes = classNames(props.className, styles.listItem);
  }

  classes = props.selectItem ? classNames(styles.selected, classes) : classes;

  return (
    <li {...props} className={classes} />
  );
}
