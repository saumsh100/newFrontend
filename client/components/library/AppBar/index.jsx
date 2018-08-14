
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function AppBar(props) {
  const { className, children } = props;

  const classes = classNames(className, styles.appBar);
  return <header className={classes}>{children}</header>;
}

AppBar.propTypes = {
  className: PropTypes.string,
};
