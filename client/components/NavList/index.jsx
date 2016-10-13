
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Nav, NavItem, NavLink } from '../library';
import styles from './styles.scss';

export default function NavList({ location }) {
  const inactiveClass = styles.navItem;
  const activeClass = classNames(styles.navItem, styles.activeItem);
  return (
    <div>
      <Nav>
        <NavItem>
          <NavLink
            href="#"
            className={location.pathname === '/' ? activeClass : inactiveClass}
          >
            <Link to="/">Dashboard</Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            className={location.pathname === '/vendasta' ? activeClass : inactiveClass}
          >
            <Link to="/vendasta">Vendasta</Link>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            className={location.pathname === '/account' ? activeClass : inactiveClass}
          >
            <Link to="/account">Account</Link>
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}
