
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import styles from './styles.scss';

export default function Toggle(props) {
  const {
    className,
  } = props;

  const classes = classNames(className, 'CareCruToggle');

  return (
    <RCToggle
      {...props}
      className={classes}
    />
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
};
