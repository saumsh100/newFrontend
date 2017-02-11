
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function CardHeader(props) {
  const {
    className,
    children,
    title,
    count,
  } = props;

  const classes = classNames(className, styles.cardHeader);

  let countComponent = null;
  if (count || count === 0) {
    countComponent = (
      <div className={styles.count}>
        {count}
      </div>
    );
  }

  let titleComponent = null;
  if (title) {
    titleComponent = (
      <div className={styles.title}>
        {title}
      </div>
    );
  }

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...props} className={classes}>
      <div className={styles.displayFlex}>
        {countComponent}
        {titleComponent}
      </div>
      <div className={styles.displayFlex}>
        {children}
      </div>
    </div>
  );
}

CardHeader.propTypes = {
};
