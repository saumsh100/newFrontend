
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Button(props) {
  let classes = classNames(props.className, styles.default, props.flat ? styles.flat : styles.notFlat);
  return <button {...props} className={classes} />;
}

Button.propTypes = {
  flat: PropTypes.bool,
  className: PropTypes.string,
};
