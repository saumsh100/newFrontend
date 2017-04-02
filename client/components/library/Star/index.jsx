
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Star(props) {
  const {
    size,
  } = props;
  
  const fontAwesomeClass = 'fa fa-star';
  const className = classNames(fontAwesomeClass, styles.star);

  return <i className={className} style={{fontSize: size + 'em'}} />;
}

Star.defaultProps = {
  size: 1
};

Star.propTypes = {
  size: PropTypes.number,
};
