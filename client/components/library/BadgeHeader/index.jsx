
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import styles from './styles.scss';

export default function BadgeHeader(props) {
  const { className, title, count } = props;

  const classes = classNames(className, styles.badgeHeader);

  let countComponent = null;
  if (count || count === 0) {
    countComponent = <div className={styles.badgeCount}>{count}</div>;
  }

  let titleComponent = null;
  if (title) {
    titleComponent = (
      <div className={classes.title || styles.title}>{title}</div>
    );
  }

  const newProps = omit(props, ['count']);

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...newProps} className={classes}>
      <div className={styles.displayFlex}>
        {titleComponent}
        <div className={styles.countContainer}>{countComponent}</div>
      </div>
    </div>
  );
}

BadgeHeader.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
  title: PropTypes.string,
};
