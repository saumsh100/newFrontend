
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Icon(props) {
  const {
    icon,
    size,
    className,
    onClick,
    style,
  } = props;

  const fontAwesomeClass = `fa fa-${icon} ${styles.icon}`;
  const classes = classNames(className, fontAwesomeClass);

  const finalStyles = Object.assign({}, { fontSize: size + 'em' }, style);

  return <i className={classes} data-test-id={props["data-test-id"]} style={finalStyles} onClick={onClick} />;
}

Icon.defaultProps = {
  size: 1,
};

Icon.propTypes = {
  icon: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
};
