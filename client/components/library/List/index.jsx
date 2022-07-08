import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';
import styles from './reskin-styles.scss';

export function List(props) {
  const classes = classNames(props.className, styles.list);
  return <ul {...props} className={classes} />;
}

List.propTypes = {
  className: PropTypes.string,
};

List.defaultProps = {
  className: '',
};

export function ListItem(props) {
  const { className, disabledClass, selectedClass, selectItem } = props;

  const classes = classNames(className, {
    [styles.disabledListItem]: props.disabled,
    [disabledClass]: props.disabled && disabledClass,
    [styles.listItem]: !props.disabled,
    [styles.selected]: selectItem,
    [selectedClass]: selectItem && selectedClass,
  });

  const newProps = omit(props, ['selectItem', 'className', 'selectedClass', 'disabledClass']);
  return <li {...newProps} className={classes} />;
}

ListItem.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  disabledClass: PropTypes.string,
  selectedClass: PropTypes.string,
  selectItem: PropTypes.bool,
};

ListItem.defaultProps = {
  disabled: false,
  className: '',
  disabledClass: '',
  selectedClass: '',
  selectItem: false,
};
