
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import FeatureFlagWrapper from '../FeatureFlagWrapper';
import styles from './styles.scss';

function NavList({
  location,
  isCollapsed,
  isSuperAdmin,
  withEnterprise,
  unreadChats,
  onlineRequests,
}) {
  const { navItem, activeItem, activeLabel } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);

  const inactiveLabelClass = styles.label;
  const activeLabelClass = classNames(styles.label, activeLabel);

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
      <Link to={path} disabled={disabled} href={path}>
        <NavItem className={classes}>
          <Icon icon={icon} className={styles.icon} size={1.5} type={iconType} badgeText={badge} />
          {labelComponent}
        </NavItem>
      </Link>
    );
  };

  SingleNavItem.propTypes = {
    label: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    iconType: PropTypes.string,
    path: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    badge: PropTypes.number,
  };
  SingleNavItem.defaultProps = {
    disabled: false,
    badge: 0,
    iconType: 'solid',
    active: false,
  };

  const MultiNavItem = ({
    path, icon, label, children, iconType,
  }) => {
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

  MultiNavItem.propTypes = {
    label: PropTypes.string.isRequired,
    iconType: PropTypes.string,
    path: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.objectOf(PropTypes.any),
    ]).isRequired,
  };

  MultiNavItem.defaultProps = {
    iconType: 'solid',
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
      styles.multiple_nav__active,
    );
    const className = active ? activeSubClass : inactiveSubClass;
    return (
      <li className={styles.multiple_nav__item}>
        <div className={styles.multiple_nav__wrapper}>
          <Link to={path} className={className} disabled={disabled} href={path}>
            {label}
          </Link>
        </div>
      </li>
    );
  };

  SubNavItem.propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    path: PropTypes.string.isRequired,
  };

  SubNavItem.defaultProps = {
    disabled: false,
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
          label={renderIf(withEnterprise, () => 'Dashboard', () => 'Dashboard')}
        />

        <SingleNavItem
          path="/schedule"
          icon="calendar-alt"
          label="Schedule"
          badge={onlineRequests}
        />
        <SingleNavItem path="/patients/list" icon="heart" label="Patient Management" />
        <SingleNavItem
          path="/chat"
          icon="comment-alt"
          label="Chat"
          badge={unreadChats}
          active={location.pathname.indexOf('/chat') !== -1}
        />

        <FeatureFlagWrapper featureKey="feature-call-tracking">
          <SingleNavItem path="/calls" icon="phone" label="Call Tracking" />
        </FeatureFlagWrapper>

        <MultiNavItem path="/reputation" icon="bullhorn" label="Marketing">
          <SubNavItem path="/reputation/reviews" label="Reviews" />
          <SubNavItem path="/reputation/listings" label="Listings" />
        </MultiNavItem>

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
  isCollapsed: PropTypes.bool.isRequired,
  isSuperAdmin: PropTypes.bool,
  withEnterprise: PropTypes.bool.isRequired,
  unreadChats: PropTypes.number,
  onlineRequests: PropTypes.number,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
};

NavList.defaultProps = {
  isSuperAdmin: false,
  unreadChats: 0,
  onlineRequests: 0,
};

function mapStateToProps({ chat, entities }) {
  const unreadChats = chat.get('unreadChats');
  const requests = entities.getIn(['requests', 'models']);
  const filteredRequests = requests
    .toArray()
    .filter(req => !req.get('isCancelled') && !req.get('isConfirmed'));

  const chatsLength = unreadChats.length > 100 ? '99+' : unreadChats.length;
  const requestsLength = filteredRequests.length > 100 ? '99+' : filteredRequests.length;

  return {
    unreadChats: chatsLength,
    onlineRequests: requestsLength,
  };
}

const enhance = connect(mapStateToProps);

export default enhance(withAuthProps(NavList));
