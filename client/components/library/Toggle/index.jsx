
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RCToggle from 'react-toggle';
import styles from './styles.scss';

export default function Toggle(props) {
  const {
    className,
    icons,
    color,
    theme,
  } = props;

  let classes = classNames(className, 'CareCruToggle', `CareCruToggle-${color}`);
  if (theme) {
    classes = classNames(styles[`theme_${theme}Background`], className);
  }

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
  icons: PropTypes.bool,
  theme: PropTypes.string,
};

Toggle.defaultProps = {
  color: 'red',
  icons: false,
};
