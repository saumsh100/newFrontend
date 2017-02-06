
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link as RRLink } from 'react-router';
import styles from  './styles.scss';

export default function Link(props) {
  const {
    className,
    disabled = false,
  } = props;
  
  let classes = classNames(className, styles.link);
  let onClick = () => {};
  if (disabled) {
    classes = classNames(classes, styles.disabled);
    onClick = e => e.preventDefault();
  }

  return <RRLink {...props} className={classes} onClick={onClick} />;
}

Link.propTypes = {
  to: PropTypes.string.required,
  disabled: PropTypes.bool,
};
