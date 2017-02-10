
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from '../CardHeader/styles.scss';

export default function CardHeader(props) {
  const {
    className,
    children,
    title,
    count,
  } = props;

  const classes = classNames(className, styles.card);

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...props} className={classes}>
      <div >
        <div> {count} {title} </div>
      </div>
        {children}
    </div>
  );
}

CardHeader.propTypes = {
};
