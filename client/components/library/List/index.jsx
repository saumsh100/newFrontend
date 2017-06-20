
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

  let showIconComponent = props.selectItem ? (
    <div className={styles.selectedListItemIcon}>
      <Icon icon="chevron-circle-right" size={1}/>
    </div>
  ) : null;

  return (
    <li {...props} className={classes} >
      {props.children}
      {showIconComponent}
    </li>
  );
}
