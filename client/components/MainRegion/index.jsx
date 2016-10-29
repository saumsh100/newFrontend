
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function MainRegion({ children, isCollapsed }) {
  const mainRegionClassName = classNames(
    styles.rightSectionContainer,
    isCollapsed ?
      styles.mainRegionContainerCollapsed :
      styles.mainRegionContainer
  );
  
  return (
    <div className={mainRegionClassName}>
      {children}
    </div>
  );
}

MainRegion.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};
