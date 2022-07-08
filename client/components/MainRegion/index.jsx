import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styles from './reskin-styles.scss';

export default function MainRegion({ children, isCollapsed }) {
  const mainRegionClassName = classNames(
    styles.rightSectionContainer,
    isCollapsed ? styles.mainRegionContainerCollapsed : styles.mainRegionContainer,
  );

  return <div className={mainRegionClassName}>{children}</div>;
}

MainRegion.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

MainRegion.defaultProps = { children: [] };
