
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Star(props) {
  const { size, className } = props;

  const fontAwesomeClass = 'fa fa-star';
  const classes = classNames(className, fontAwesomeClass, styles.star);
  return <i className={classes} style={{ fontSize: `${size}em` }} />;
}

Star.defaultProps = {
  size: 1,
};

Star.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};
