
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export function Nav(props) {
  const { children, className } = props;

  const classes = classNames(className, styles.nav);

  return (
    <nav className={classes}>
      <ul className={styles.ul}>{children}</ul>
    </nav>
  );
}

export function NavItem(props) {
  const { children, className } = props;

  const classes = classNames(className, styles.navItem);

  return <li className={classes}>{children}</li>;
}
