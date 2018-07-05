
import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Header(props) {
  const {
    className, children, title, contentHeader,
  } = props;

  const classes = classNames(className, styles.plainHeader);

  let titleComponent = null;
  let titleClassName = styles.headerTitle;

  if (contentHeader) {
    titleClassName = classNames(titleClassName, styles.lightHeader);
  }

  if (title) {
    titleComponent = <div className={titleClassName}>{title}</div>;
  }

  const newProps = omit(props, ['contentHeader']);
  return (
    <div {...newProps} className={classes}>
      <div className={styles.displayFlex}>{titleComponent}</div>
      <div className={styles.displayFlex}>{children}</div>
    </div>
  );
}

Header.propTypes = {
  contentHeader: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  className: PropTypes.string,
};

Header.defaultProps = {
  contentHeader: false,
  children: null,
  className: '',
};
