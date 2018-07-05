
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';

export default function Badge(props) {
  const { badgeStyle, containerStyle, children } = props;

  const finalContainerStyle = classNames(styles.badgeWrapper, containerStyle);
  const finalBadgeStyle = classNames(styles.badgeWrapper_badge, badgeStyle);

  return (
    <div className={finalContainerStyle}>
      <div className={finalBadgeStyle}>{children}</div>
    </div>
  );
}

Badge.propTypes = {
  badgeStyle: PropTypes.string,
  containerStyle: PropTypes.string,
  children: PropTypes.node,
};

Badge.defaultProps = {
  badgeStyle: null,
  containerStyle: null,
  children: null,
};
