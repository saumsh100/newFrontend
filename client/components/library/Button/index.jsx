
import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from './styles.scss';

const cx = classNames.bind(styles);

export default function Button(props) {
  const classes = classNames(
    props.className,
    cx({
      default: true,
      flat: props.flat,
      disabled: props.disabled,
    })
  );

  return <button {...props} className={classes} />;
}

Button.propTypes = {
  flat: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
