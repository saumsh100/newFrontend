
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Header(props) {
  const {
    className,
    children,
    title,
    contentHeader,
  } = props;

  const classes = classNames(className, styles.plainHeader);

  let titleComponent = null;
  let titleClassName = styles.headerTitle;

  if (contentHeader) {
    titleClassName = classNames(titleClassName, styles.lightHeader)
  }

  if (title) {
    titleComponent = (
      <div className={titleClassName}>
        {title}
      </div>
    );
  }

  return (
    <div {...props} className={classes}>
      <div className={styles.displayFlex}>
        {titleComponent}
      </div>
      <div className={styles.displayFlex}>
        {children}
      </div>
    </div>
  );
}

Header.propTypes = {
  contentHeader: PropTypes.bool,
};
