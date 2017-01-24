
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import styles from './styles.scss';

export default function NavList({ location }) {
  const {
    navItem,
    activeItem,
    label,
    activeLabel,
  } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);
  
  const inactiveLabelClass = label;
  const activeLabelClass = classNames(label, activeLabel);
  
  const SingleNavItem = ({ path, icon, label, active }) => {
    active = active || location.pathname === path;
    return (
      <Link to={path}>
        <NavItem className={active ? activeClass : inactiveClass}>
          <Icon icon={icon} className={styles.icon} />
          <div className={active ? activeLabelClass : inactiveLabelClass}>
            {label}
          </div>
        </NavItem>
      </Link>
    );
  };
  
  const MultiNavItem = ({ path, icon, label, subItems }) => {
    const active = location.pathname.indexOf('/patients') === 0;
    return (
      <div>
        <SingleNavItem path={path} icon={icon} label={label} active={active} />
      </div>
    );
  };

  return (
    <div className={styles.navListWrapper}>
      <Nav>
        <SingleNavItem path="/" icon="tachometer" label="Dashboard" />
        <SingleNavItem path="/intelligence" icon="bar-chart" label="Practice Intelligence" />
        <SingleNavItem path="/schedule" icon="calendar" label="Schedule" />
        <MultiNavItem  path="/patients" icon="heart" label="Patient Management" />
        <SingleNavItem path="/reputation" icon="star" label="Reputation" />
        <SingleNavItem path="/social" icon="thumbs-up" label="Social Media" />
        <SingleNavItem path="/loyalty" icon="trophy" label="Loyalty" />
        <SingleNavItem path="/newsletters" icon="envelope" label="Email Newsletters" />
        <SingleNavItem path="/website" icon="desktop" label="Website" />
        <SingleNavItem path="/settings" icon="cogs" label="Account Settings" />
        <SingleNavItem path="/profile" icon="tachometer" label="Profile" />
      </Nav>
    </div>
  );
}
