
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import styles from './styles.scss';

export default function Toggle(props) {
  const {
    className,
    icons,
    color,
  } = props;

  const classes = classNames(className, 'CareCruToggle', `CareCruToggle-${color}`);

  return (
    <RCToggle
      {...props}
      icons={icons}
      className={classes}
    />
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  icons: PropTypes.boolean,
};

Toggle.defaultProps = {
  color: 'red',
  icons: false,
};
