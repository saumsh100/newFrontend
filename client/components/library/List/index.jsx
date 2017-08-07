
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
  let classes = props.className;

  if (props.disabled) {
    classes = classNames(classes, styles.disabledListItem);
  } else {
    classes = classNames(props.className, styles.listItem);
  }

  classes = props.selectItem ? classNames(styles.selected, classes) : classes;

  const newProps = omit(props, ['selectItem']);
  return (
    <li {...newProps} className={classes} />
  );
}

ListItem.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
