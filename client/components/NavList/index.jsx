import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import EnabledFeature from '../library/EnabledFeature';
import styles from './reskin-styles.scss';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

function NavList({
  location,
  isSuperAdmin,
  unreadChats,
  onlineRequests,
  navigationPreferences,
  waitingRoomQueueLength,
  enterpriseManagementPhaseTwoActive,
  isCollapsed,
  scheduleNotification,
}) {
  const { navItem, activeItem } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);

  const inactiveLabelClass = styles.label;
  const scheduleBadgeCount = onlineRequests + scheduleNotification;

  const SingleNavItem = ({
    path,
    icon,
    label,
    active,
    disabled,
    iconType = 'solid',
    badge = false,
    type,
  }) => {
    active = active || location.pathname === path;
    let classes = active ? activeClass : inactiveClass;

    disabled = disabled || type === 'disabled';
    classes = classNames(classes, {
      [styles.disabledItem]: disabled,
    });

    const labelComponent = (
      <div className={classNames(inactiveLabelClass)}>
        <p className={styles.labelText}>{label}</p>
      </div>
    );

    return (
      <Link to={path} disabled={disabled} href={path}>
        <NavItem className={classes}>
          <div className={styles.iconContainer}>
            <Icon
              icon={icon}
              className={styles.icon}
              size={enterpriseManagementPhaseTwoActive ? 1 : 1.5}
              type={iconType}
              badgeText={badge}
            />
          </div>
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
    type: PropTypes.string,
  };
  SingleNavItem.defaultProps = {
    disabled: false,
    badge: 0,
    iconType: 'solid',
    active: false,
    type: 'active',
  };

  const MultiNavItem = ({ path, icon, label, children, iconType, type }) => {
    const active = location.pathname.indexOf(path) === 0;
    let content = null;
    if (active) {
      content = <ul className={styles.multiple_nav}>{children}</ul>;
    }

    return (
      <div>
        <SingleNavItem
          path={path}
          icon={icon}
          label={label}
          active={active}
          iconType={iconType}
          type={type}
        />
        {type === 'disabled' ? null : content}
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
    type: PropTypes.string,
  };

  MultiNavItem.defaultProps = { iconType: 'solid', type: 'active' };

  const SubNavItem = ({ path, label, disabled }) => {
    const active = location.pathname.indexOf(path) === 0;
    const disabledClass = styles.disabledSubNavItem;
    const inactiveSubClass = classNames(styles.liSubNavItem, { [disabledClass]: disabled });

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
            <p className={styles.labelText}>{label}</p>
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

  SubNavItem.defaultProps = { disabled: false };

  // Helper to reduce code length on for single line components
  const getNavigationPreference = (key) => navigationPreferences[key];
  return (
    <div
      className={classNames({
        [styles.navListWrapper]: isCollapsed,
        [styles.navListWrapper_marginTop]: !isCollapsed,
      })}
    >
      <Nav>
        <SingleNavItem
          path="/"
          icon="tachometer"
          label="Dashboard"
          badge={waitingRoomQueueLength}
          type={getNavigationPreference('dashboard')}
        />
        <SingleNavItem
          path="/intelligence"
          label="Intelligence"
          icon="chart-bar"
          type={getNavigationPreference('intelligence')}
        />
        <SingleNavItem
          path="/schedule"
          icon="calendar-alt"
          label="Schedule"
          badge={scheduleBadgeCount}
          type={getNavigationPreference('schedule')}
        />
        <SingleNavItem
          path="/patients/list"
          icon="heart"
          label="Patient Management"
          type={getNavigationPreference('patients')}
        />
        <SingleNavItem
          path="/chat"
          icon="comment-alt"
          label="Chat"
          badge={unreadChats}
          active={location.pathname.indexOf('/chat') !== -1}
          type={getNavigationPreference('chat')}
        />
        <SingleNavItem
          path="/calls"
          icon="phone"
          label="Call Tracking"
          type={getNavigationPreference('calls')}
        />
        <MultiNavItem
          path="/reputation"
          icon="bullhorn"
          label="Marketing"
          type={getNavigationPreference('marketing')}
        >
          <SubNavItem path="/reputation/reviews" label="Reviews" />
          <SubNavItem path="/reputation/listings" label="Listings" />
        </MultiNavItem>
        <MultiNavItem
          path="/settings"
          icon="cogs"
          label="Account Settings"
          type={getNavigationPreference('settings')}
        >
          <SubNavItem path="/settings/practice" label="Practice" />
          <SubNavItem path="/settings/reasons" label="Reasons" />
          <SubNavItem path="/settings/practitioners" label="Practitioners" />
          <SubNavItem path="/settings/donna" label="Donna" />
          <EnabledFeature
            predicate={({ flags }) => flags.get('forms-tab-in-practice-settings')}
            render={() => <SubNavItem path="/settings/forms" label="Forms" />}
          />
        </MultiNavItem>
        <EnabledFeature
          predicate={() => isSuperAdmin}
          render={() => (
            <MultiNavItem path="/admin" icon="superpowers" label="Global Admin" iconType="brand">
              <SubNavItem path="/admin/enterprises" label="Enterprises" />
              <SubNavItem path="/admin/integrations" label="Integrations" />
            </MultiNavItem>
          )}
        />
      </Nav>
    </div>
  );
}

NavList.propTypes = {
  isSuperAdmin: PropTypes.bool,
  unreadChats: PropTypes.number,
  onlineRequests: PropTypes.number,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigationPreferences: PropTypes.shape({
    dashboard: PropTypes.string,
    intelligence: PropTypes.string,
    schedule: PropTypes.string,
    patients: PropTypes.string,
    chat: PropTypes.string,
    marketing: PropTypes.string,
    settings: PropTypes.string,
  }),
  waitingRoomQueueLength: PropTypes.number.isRequired,
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

NavList.defaultProps = {
  isSuperAdmin: false,
  unreadChats: 0,
  onlineRequests: 0,
  navigationPreferences: {},
};

function mapStateToProps({ chat, entities, waitingRoom, featureFlags, toolbar, schedule }) {
  const unreadChatsCount = chat.get('unreadChatsCount');
  const requests = entities.getIn(['requests', 'models']);
  const filteredRequests = requests
    .toArray()
    .filter((req) => !req.get('isCancelled') && !req.get('isConfirmed'));
  const { scheduleNotification } = schedule.toJS();

  const chatsLength = unreadChatsCount > 100 ? '99+' : unreadChatsCount;
  const requestsLength = filteredRequests.length > 100 ? '99+' : filteredRequests.length;

  const canSeeVirtualWaitingRoom = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'virtual-waiting-room-ui',
  );

  const waitingRoomQueue = waitingRoom.get('waitingRoomQueue');

  return {
    unreadChats: chatsLength,
    onlineRequests: requestsLength,
    waitingRoomQueueLength:
      waitingRoomQueue && canSeeVirtualWaitingRoom ? waitingRoomQueue.length : 0,
    enterpriseManagementPhaseTwoActive: featureFlags.getIn([
      'flags',
      'enterprise-management-phase-2',
    ]),
    isCollapsed: toolbar.get('isCollapsed'),
    scheduleNotification,
  };
}

const enhance = connect(mapStateToProps);

export default enhance(withAuthProps(NavList));
