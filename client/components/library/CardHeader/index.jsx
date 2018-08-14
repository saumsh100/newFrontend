
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import styles from './styles.scss';

export default function CardHeader(props) {
  const {
    className, children, title, count, buttons,
  } = props;

  const classes = classNames(className, styles.cardHeader);

  let countComponent = null;
  if (count || count === 0) {
    countComponent = (
      <div className={styles.cardCount} data-test-id={props['data-test-id']}>
        {count}
      </div>
    );
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
        {countComponent}
        {titleComponent}
      </div>
      <div className={styles.displayFlex}>{children}</div>
    </div>
  );
}

CardHeader.propTypes = {
  count: PropTypes.number,
};
