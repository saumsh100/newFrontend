
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Card(props) {
  const {
    children,
    className,
    borderColor,
    fontColor,
  } = props;
  const classes = classNames(className, styles.card);

  return (
    // Order is important, classNames={classes} needs to override props.className
    <div {...props} style={{borderTop: '5px solid ' + borderColor, color: fontColor}} className={classes}>
      {children}
    </div>
  );
}

Card.propTypes = {
  //children: PropTypes.object.isRequired,
};
