
import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import classNames from 'classnames';
import styles from './styles.scss';

export function List(props) {
  const classes = classNames(props.className, styles.list);
  return <ul {...props} className={classes} />;
}

export function ListItem(props) {
  const {
    className, disabledClass, selectedClass, selectItem,
  } = props;

  let classes = className;
  if (props.disabled) {
    classes = classNames(classes, styles.disabledListItem, disabledClass);
  } else {
    classes = classNames(classes, styles.listItem);
  }

  classes = selectItem
    ? classNames(classes, styles.selected, selectedClass)
    : classes;

  const newProps = omit(props, ['selectItem', 'className']);
  return <li {...newProps} className={classes} />;
}

ListItem.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClass: PropTypes.string,
  selectedClass: PropTypes.string,
  selectItem: PropTypes.bool,
};
