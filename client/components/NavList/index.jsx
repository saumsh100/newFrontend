
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon } from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import EnabledFeature from '../library/EnabledFeature';
import styles from './styles.scss';

function NavList({ location, isCollapsed, isSuperAdmin, unreadChats, onlineRequests }) {
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
  }) => {
    active = active || location.pathname === path;
    let classes = active ? activeClass : inactiveClass;

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
  };
  SingleNavItem.defaultProps = {
    disabled: false,
    badge: 0,
    iconType: 'solid',
    active: false,
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

  MultiNavItem.defaultProps = { iconType: 'solid' };

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

  return (
    <div className={styles.navListWrapper}>
      <Nav>
        <SingleNavItem path="/" icon="tachometer" label="Dashboard" />
        <EnabledFeature
          predicate={({ flags }) => flags.get('feature-mode-reports-tab')}
          render={() => (
            <SingleNavItem path="/intelligence" label="Intelligence" icon="chart-bar" />
          )}
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

        <EnabledFeature
          predicate={({ flags }) => flags.get('feature-call-tracking')}
          render={<SingleNavItem path="/calls" icon="phone" label="Call Tracking" />}
        />

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
