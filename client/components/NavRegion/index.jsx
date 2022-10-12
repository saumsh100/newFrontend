import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import EnabledFeature from '../library/EnabledFeature';
import styles from './reskin-styles.scss';

export default function NavRegion({ children, className, setIsSidebarHovered }) {
  const PoweredByFooter = () => (
    <div className={styles.footer}>
      <div>Powered By</div>
      <div>
        <img className={styles.logoCareCru} src="/images/carecru_logo.png" alt="CareCru Logo" />
      </div>
    </div>
  );

  return (
    <div
      className={classNames(styles.leftSectionContainer, className)}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
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
  className: PropTypes.string,
  setIsSidebarHovered: PropTypes.func,
};

NavRegion.defaultProps = {
  children: null,
  className: '',
  setIsSidebarHovered: () => {},
};
