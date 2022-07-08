import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Link as RRLink } from 'react-router-dom';
import styles from './reskin-styles.scss';

export default function Link(props) {
  const { className, disabled = false } = props;

  let classes = classNames(className, styles.link);
  let onClick = () => {};
  if (disabled) {
    classes = classNames(classes, styles.disabled);
    onClick = (e) => e.preventDefault();
  }

  return <RRLink {...props} className={classes} onClick={onClick} />;
}

Link.propTypes = {
  disabled: PropTypes.bool,
};
