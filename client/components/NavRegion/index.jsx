import PropTypes from 'prop-types';
import React from 'react';
import EnabledFeature from '../library/EnabledFeature';
import styles from './reskin-styles.scss';

export default function NavRegion({ children, isCollapsed }) {
  const navRegionClassName = isCollapsed ? styles.navHidden : styles.leftSectionContainer;

  const PoweredByFooter = () => (
    <div className={styles.footer}>
      <div>Powered By</div>
      <div>
        {isCollapsed ? (
          <img
            className={styles.logoCareCruCollapsed}
            src="/images/carecru_logo_collapsed.png"
            alt="CareCru Logo"
          />
        ) : (
          <img className={styles.logoCareCru} src="/images/carecru_logo.png" alt="CareCru Logo" />
        )}
      </div>
    </div>
  );

  return (
    <div className={navRegionClassName}>
      <div className={styles.navListWrapper}>{children}</div>
      <EnabledFeature
        predicate={({ flags }) => flags.get('dcc-custom-sidebar')}
        render={PoweredByFooter()}
      />
    </div>
  );
}

NavRegion.propTypes = {
  children: PropTypes.node,
  isCollapsed: PropTypes.bool.isRequired,
};

NavRegion.defaultProps = {
  children: null,
};
