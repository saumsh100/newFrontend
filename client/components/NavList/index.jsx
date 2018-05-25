
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import FeatureFlagWrapper from '../FeatureFlagWrapper';
import styles from './styles.scss';

function NavList({ location, isCollapsed, isSuperAdmin, withEnterprise, unreadChats }) {
  const { navItem, activeItem, label, activeLabel } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);

  const inactiveLabelClass = label;
  const activeLabelClass = classNames(label, activeLabel);
  
  const SingleNavItem = ({
    path,
    icon,
    label,
    active,
    disabled,
    iconType = 'solid',
    badge = false,
  }) => {
    active = active || location.pathname === path;
    let classes = active ? activeClass : inactiveClass;
    if (disabled) {
      classes = classNames(classes, styles.disabledItem);
    }

    let labelComponent = null;
    if (!isCollapsed) {
      labelComponent = (
        <div className={active ? activeLabelClass : inactiveLabelClass}>{label}</div>
      );
    }

    return (
      <Link to={path} disabled={disabled}>
        <NavItem className={classes}>
          <Icon icon={icon} className={styles.icon} size={1.5} type={iconType} badgeText={badge} />
          {labelComponent}
        </NavItem>
      </Link>
    );
  };

  const MultiNavItem = ({ path, icon, label, children, iconType }) => {
    const active = location.pathname.indexOf(path) === 0;

    let content = null;
    if (active && !isCollapsed) {
      content = <ul className={styles.multiple_nav}>{children}</ul>;
    }

    return (
      <div>
        <SingleNavItem path={path} icon={icon} label={label} active={active} iconType={iconType} />
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

    const activeSubClass = classNames(
      inactiveSubClass,
      styles.activeSubNavItem,
      styles.multiple_nav__active
    );
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

  const renderIf = (cond, render, alt) => (cond ? render() : (alt && alt()) || null);

  return (
    <div className={styles.navListWrapper}>
      <Nav>
        {renderIf(withEnterprise, () => (
          <MultiNavItem path="/enterprise" icon="building" label="Enterprise Dashboard">
            <SubNavItem path="/enterprise/patients" label="Patients" />
          </MultiNavItem>
        ))}
        <SingleNavItem
          path="/"
          icon="tachometer"
          label={renderIf(withEnterprise, () => 'Clinic Dashboard', () => 'Dashboard')}
        />
        {/* <MultiNavItem path="/intelligence" icon="bar-chart" label="Practice Intelligence">
          <SubNavItem path="/intelligence/overview" label="Overview" />
          <SubNavItem path="/intelligence/business" label="Business" />
          <SubNavItem path="/intelligence/social" label="Social" disabled/>
        </MultiNavItem>*/}
        <SingleNavItem path="/schedule" icon="calendar-alt" label="Schedule" />
        <SingleNavItem path="/patients/list" icon="heart" label="Patient Management" />
        <SingleNavItem path="/chat" icon="comment-alt" label="Chat" badge={unreadChats} />
        <FeatureFlagWrapper featureKey="feature-call-tracking">
          <SingleNavItem path="/calls" icon="phone" label="Call Tracking" />
        </FeatureFlagWrapper>

        {/* <SingleNavItem path="/social" icon="thumbs-up" label="Social Media" disabled />*/}

        <MultiNavItem path="/reputation" icon="bullhorn" label="Marketing">
          <SubNavItem path="/reputation/listings" label="Listings" />
          <SubNavItem path="/reputation/reviews" label="Reviews" />
        </MultiNavItem>
        {/* <MultiNavItem path="/social" icon="thumbs-up" label="Social Media" disabled>
          <SubNavItem path="/social/patient" label="Patient Posts" disabled/>
          <SubNavItem path="/social/practice" label="Practice Posts" disabled/>
        </MultiNavItem>
        <SingleNavItem path="/newsletters" icon="envelope" label="Email Newsletters" disabled />
        <SingleNavItem path="/website" icon="desktop" label="Website" disabled />*/}
        <MultiNavItem path="/settings" icon="cogs" label="Account Settings">
          <SubNavItem path="/settings/practice" label="Practice" />
          <SubNavItem path="/settings/reasons" label="Reasons" />
          <SubNavItem path="/settings/practitioners" label="Practitioners" />
          <SubNavItem path="/settings/donna" label="Donna" />
        </MultiNavItem>

        {renderIf(isSuperAdmin, () => (
          <MultiNavItem path="/admin" icon="superpowers" label="Super Admin" iconType="brand">
            <SubNavItem path="/admin/enterprises" label="Enterprises" />
            <SubNavItem path="/admin/nasa" label="NASA" />
            <SubNavItem path="/admin/play" label="Playground" />
          </MultiNavItem>
        ))}
      </Nav>
    </div>
  );
}

NavList.propTypes = {
  isCollapsed: PropTypes.bool,
  isSuperAdmin: PropTypes.bool,
  label: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  iconType: PropTypes.string,
  location: PropTypes.shape(PropTypes.string),
  withEnterprise: PropTypes.bool,
  unreadChats: PropTypes.number,
};

function mapStateToProps({ chat }) {
  const unreadChats = chat.get('unreadChats');
  const length = unreadChats.length > 100 ? '99+' : unreadChats.length;

  return {
    unreadChats: length,
  };
}

const enhance = connect(mapStateToProps);

export default enhance(withAuthProps(NavList));
