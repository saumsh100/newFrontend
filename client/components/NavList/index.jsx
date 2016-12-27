
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { browserHistory, Link } from 'react-router';
import { Nav, NavItem, NavLink } from '../library';
import styles from './styles.scss';

export default function NavList({ location }) {
  const {
    navItem,
    activeItem,
    fixedBottomItem,
  } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);
  const bottomClass = fixedBottomItem;

  return (
    <div>
      <Nav>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/')}
            className={location.pathname === '/' ? activeClass : inactiveClass}
          >
            Dashboard
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/schedule')}
            className={location.pathname === '/schedule' ? activeClass : inactiveClass}
          >
            Schedule
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/patients')}

            // Has the indexOf because of nested routes
            className={location.pathname.indexOf('/patients') === 0 ? activeClass : inactiveClass}
          >
            Patients
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/reputation')}
            className={location.pathname === '/reputation' ? activeClass : inactiveClass}
          >
            Reputation
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/social')}
            className={location.pathname === '/social' ? activeClass : inactiveClass}
          >
            Social
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/loyalty')}
            className={location.pathname === '/loyalty' ? activeClass : inactiveClass}
          >
            Loyalty
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/seo')}
            className={location.pathname === '/seo' ? activeClass : inactiveClass}
          >
            SEO
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/newsletters')}
            className={location.pathname === '/newsletters' ? activeClass : inactiveClass}
          >
            Newsletters
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/settings')}
            className={
              classNames(
                location.pathname === '/settings' ? activeClass : inactiveClass,
                bottomClass
              )
            }
          >
            Settings
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            onClick={() => browserHistory.push('/profile')}
            className={location.pathname === '/profile' ? activeClass : inactiveClass}
          >
            Profile
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}
