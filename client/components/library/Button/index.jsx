
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Button(props) {
  const classes = classNames(props.className, styles.default);
  return <button {...props} className={classes} />;
}

Button.propTypes = {
  className: PropTypes.string,
};
