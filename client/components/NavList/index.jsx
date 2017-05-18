
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon, Tooltip } from '../library';
import styles from './styles.scss';

const PATHS = {
  '/patients': [
    {  }
  ],

};

function NavList({ location, isCollapsed, isSuperAdmin }) {
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

  const SingleNavItem = ({ path, icon, label, active, disabled }) => {
    active = active || location.pathname === path;
    let classes = active ? activeClass : inactiveClass;
    if (disabled) {
      classes = classNames(classes, styles.disabledItem);
    }

    let labelComponent = null;
    if (!isCollapsed) {
      labelComponent = (
        <div className={active ? activeLabelClass : inactiveLabelClass}>
          {label}
        </div>
      );
    }

    return (
      <Link to={path} disabled={disabled}>
        <NavItem className={classes}>
          <Icon icon={icon} className={styles.icon} size={1.5} />
          {labelComponent}
        </NavItem>
      </Link>
    );
  };

  const MultiNavItem = ({ path, icon, label, children }) => {
    const active = location.pathname.indexOf(path) === 0;

    let content = null;
    if (active && !isCollapsed) {
      content = (
        <ul className={styles.multiple_nav}>
          {children}
        </ul>
      );
    }

    return (
      <div>
        <SingleNavItem path={path} icon={icon} label={label} active={active} />
        {content}
      </div>
    );
  };

  const SubNavItem = ({ path, label, disabled }) => {
    const active = location.pathname.indexOf(path) === 0;
    let inactiveSubClass = styles.liSubNavItem;
    if (disabled) {
      inactiveSubClass = classNames(inactiveSubClass, styles.disabledSubNavItem);
    }

    const activeSubClass = classNames(inactiveSubClass, styles.activeSubNavItem, styles.multiple_nav__active);
    const className = active ? activeSubClass : inactiveSubClass;
    return (
      <li className={styles.multiple_nav__item}>
        <div className={styles.multiple_nav__wrapper}>
          <Link to={path} className={className} disabled={disabled}>
            {label}
          </Link>
        </div>
      </li>
    );
  };

  const overlay = (
    <div className={styles.comingSoon}>
      Coming<br />
      Soon!
    </div>
  );

  return (
    <div className={styles.navListWrapper}>
      <Nav>
        <SingleNavItem path="/" icon="tachometer" label="Dashboard" />
        <MultiNavItem path="/intelligence" icon="bar-chart" label="Practice Intelligence">
          <SubNavItem path="/intelligence/overview" label="Overview" />
          <SubNavItem path="/intelligence/business" label="Business" />
          <SubNavItem path="/intelligence/social" label="Social" />
        </MultiNavItem>
        <MultiNavItem path="/schedule" icon="calendar" label="Schedule">
          <SubNavItem path="/schedule/calendar" label="Calendar View" />
          <SubNavItem path="/schedule/appointments" label="Appointments List" disabled />
        </MultiNavItem>
        <MultiNavItem path="/patients" icon="heart" label="Patient Management">
          <SubNavItem path="/patients/list" label="Patients" />
          <SubNavItem path="/patients/messages" label="Messages" />
          <SubNavItem path="/patients/phone" label="Phone Calls"/>
        </MultiNavItem>
        <MultiNavItem path="/reputation" icon="star" label="Reputation">
          <SubNavItem path="/reputation/listings" label="Listings" />
          <SubNavItem path="/reputation/reviews" label="Reviews" />
        </MultiNavItem>
        <MultiNavItem path="/social" icon="thumbs-up" label="Social Media">
          <SubNavItem path="/social/patient" label="Patient Posts" />
          <SubNavItem path="/social/practice" label="Practice Posts" />
        </MultiNavItem>
        <SingleNavItem path="/newsletters" icon="envelope" label="Email Newsletters" disabled />
        <SingleNavItem path="/website" icon="desktop" label="Website" disabled />
        <MultiNavItem path="/settings" icon="cogs" label="Account Settings">
          <SubNavItem path="/settings/clinic" label="Clinic" />
          <SubNavItem path="/settings/schedule" label="Schedule" />
          <SubNavItem path="/settings/services" label="Services" />
          <SubNavItem path="/settings/practitioners" label="Practitioners" />
        </MultiNavItem>

        {isSuperAdmin ? (
          <MultiNavItem path="/admin" icon="desktop" label="Admin Panel">
            <SubNavItem path="/admin/enterprises" label="Enterprises" />
          </MultiNavItem>
        ) : null}
      </Nav>
    </div>
  );
}

const stateToProps = state => ({
  isSuperAdmin: state.auth.get('role') === 'SUPERADMIN',
});

export default connect(stateToProps)(NavList);
