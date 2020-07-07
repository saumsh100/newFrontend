
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import EnabledFeature from '../library/EnabledFeature';
import styles from './styles.scss';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

function NavList({
  location,
  isCollapsed,
  isSuperAdmin,
  unreadChats,
  onlineRequests,
  navigationPreferences,
  waitingRoomQueueLength,
}) {
  const { navItem, activeItem } = styles;

  const inactiveClass = navItem;
  const activeClass = classNames(navItem, activeItem);

  const inactiveLabelClass = styles.label;

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
    classes = classNames(classes, { [styles.disabledItem]: disabled });

    const labelComponent = (
      <div className={classNames(inactiveLabelClass, { [styles.hiddenLabel]: isCollapsed })}>
        {label}
      </div>
    );

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
    if (active && !isCollapsed) {
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

  MultiNavItem.defaultProps = { iconType: 'solid',
    type: 'active' };

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

  SubNavItem.defaultProps = { disabled: false };

  // Helper to reduce code length on for single line components
  const n = key => navigationPreferences[key];

  return (
    <div className={styles.navListWrapper}>
      <Nav>
        <SingleNavItem
          path="/"
          icon="tachometer"
          label="Dashboard"
          badge={waitingRoomQueueLength}
          type={n('dashboard')}
        />
        <SingleNavItem
          path="/intelligence"
          label="Intelligence"
          icon="chart-bar"
          type={n('intelligence')}
        />
        <SingleNavItem
          path="/schedule"
          icon="calendar-alt"
          label="Schedule"
          badge={onlineRequests}
          type={n('schedule')}
        />
        <SingleNavItem
          path="/patients/list"
          icon="heart"
          label="Patient Management"
          type={n('patients')}
        />
        <SingleNavItem
          path="/chat"
          icon="comment-alt"
          label="Chat"
          badge={unreadChats}
          active={location.pathname.indexOf('/chat') !== -1}
          type={n('chat')}
        />
        <SingleNavItem path="/calls" icon="phone" label="Call Tracking" type={n('calls')} />
        <MultiNavItem path="/reputation" icon="bullhorn" label="Marketing" type={n('marketing')}>
          <SubNavItem path="/reputation/reviews" label="Reviews" />
          <SubNavItem path="/reputation/listings" label="Listings" />
        </MultiNavItem>
        <MultiNavItem path="/settings" icon="cogs" label="Account Settings" type={n('settings')}>
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
            <MultiNavItem path="/admin" icon="superpowers" label="Super Admin" iconType="brand">
              <SubNavItem path="/admin/enterprises" label="Enterprises" />
              <SubNavItem path="/admin/nasa" label="NASA" />
              <SubNavItem path="/admin/play" label="Playground" />
            </MultiNavItem>
          )}
        />
      </Nav>
    </div>
  );
}

NavList.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
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
};

NavList.defaultProps = {
  isSuperAdmin: false,
  unreadChats: 0,
  onlineRequests: 0,
  navigationPreferences: {},
};

function mapStateToProps({ chat, entities, waitingRoom, featureFlags }) {
  const unreadChatsCount = chat.get('unreadChatsCount');
  const requests = entities.getIn(['requests', 'models']);
  const filteredRequests = requests
    .toArray()
    .filter(req => !req.get('isCancelled') && !req.get('isConfirmed'));

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
  };
}

const enhance = connect(mapStateToProps);

export default enhance(withAuthProps(NavList));
