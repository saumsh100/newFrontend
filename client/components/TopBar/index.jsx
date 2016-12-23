
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Button } from '../library';
import styles from './styles.scss';
import { browserHistory } from 'react-router';

function logout() {
  localStorage.setItem('token', '');
  browserHistory.push('/login');
}

function TopBar({ setIsCollapsed, isCollapsed }) {
  const topBarClassName = classNames(
    styles.topBarContainer,
    isCollapsed ?
      styles.topBarContainerCollapsed :
      styles.topBarContainerUnCollapsed
  );
  
  return (
    <header className={topBarClassName}>
      <div className="container-fluid">
        <div
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i
            className="fa fa-bars"
            ariaHidden="true"
          />
        </div>
        <Button onClick={logout} className="pull-right">Log Out</Button>
      </div>
    </header>
  );
}

TopBar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default TopBar;
