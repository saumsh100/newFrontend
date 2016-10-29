
import React, { PropTypes } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from '../library';
import styles from './styles.scss';

function TopBar({ setIsCollapsed, isCollapsed }) {
  return (
    <header className={styles.topBarContainer}>
      <div className="container-fluid">
        <img
          src="/images/logo.png"
          alt="CareCru Logo"
          className={styles.logoImg}
        />
        <div
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i
            className="fa fa-bars"
            ariaHidden="true"
          />
        </div>
      </div>
    </header>
  );
}

TopBar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default TopBar;
