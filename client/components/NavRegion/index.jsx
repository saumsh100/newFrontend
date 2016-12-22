
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';

export default function NavRegion({ children, isCollapsed }) {
  const navRegionClassName = isCollapsed ? styles.navHidden : styles.leftSectionContainer;
  return (
    <div className={navRegionClassName}>
      <div className={styles.logoWrapper}>
        CARECRU
      </div>
      <div className={styles.navListWrapper}>
        {children}
      </div>
    </div>
  );
}

NavRegion.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};
