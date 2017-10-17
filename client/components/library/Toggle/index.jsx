
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import styles from './styles.scss';

export default function Toggle(props) {
  const {
    className,
    theme,
  } = props;

  let classes = classNames(className, 'CareCruToggle');

  if (theme) {
    classes = classNames(styles[`theme_${theme}Background`], className);
  }

  return (
    <RCToggle
      {...props}
      className={classes}
    />
  );
}

Toggle.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
};
