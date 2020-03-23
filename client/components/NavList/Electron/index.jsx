
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { Nav, NavItem, Link, Icon, Button } from '../../library';
import UserSettings from '../../UserSettings';
import withAuthProps from '../../../hocs/withAuthProps';
import { displayContent, collapseContent } from '../../../thunks/electron';
import { TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../../../util/hub';
import styles from './styles.scss';

const expensiveRoutesList = {
  '/requests': true,
};

function isExpensiveRoute(routePath) {
  return expensiveRoutesList[routePath];
}

function NavList(props) {
  const { location, unreadChats, newRequests, showContent, toolbarPosition } = props;

  const { navItem, activeItem } = styles;

  const onClickToggle = (active, expensive) =>
    (active ? props.collapseContent() : props.displayContent(expensive));

  const SingleNavItem = ({ path, icon, active, disabled, iconType, badge, iconImage }) => {
    active = active || location.pathname === path;

    return (
      <Link to={path} disabled={disabled}>
        <Button
          onClick={() => !disabled && onClickToggle(active, isExpensiveRoute(path))}
          className={classNames(styles.buttonNoSpacing, styles.buttonNoBg)}
        >
          <NavItem
            className={classNames(navItem, {
              [activeItem]: active,
              [styles.disabledItem]: disabled,
            })}
          >
            {icon && <Icon icon={icon} size={1.3} type={iconType} badgeText={badge} />}
            {iconImage}
          </NavItem>
        </Button>
      </Link>
    );
  };

  SingleNavItem.propTypes = {
    path: PropTypes.string.isRequired,
    icon: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    iconType: PropTypes.string,
    badge: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iconImage: PropTypes.node,
  };

  SingleNavItem.defaultProps = {
    icon: null,
    active: false,
    disabled: false,
    iconType: 'solid',
    badge: null,
    iconImage: null,
  };

  // TODO ADD NOTIFICATION BADGE WHEN READY
  // <div className={styles.badge}><span>{props.intercomNotifications}</span></div>
  const intercomIcon = <div className={styles.intercomIcon} />;
  const shortcutIcon = <div className={styles.shortcutIcon} />;

  return (
    <div
      className={classNames(styles.navListWrapper, {
        [styles.active]: showContent,
        [styles.left]: toolbarPosition === TOOLBAR_LEFT,
        [styles.right]: toolbarPosition === TOOLBAR_RIGHT,
        [styles.contentShownLeft]: showContent && toolbarPosition === TOOLBAR_LEFT,
        [styles.contentShownRight]: showContent && toolbarPosition === TOOLBAR_RIGHT,
      })}
    >
      <Button
        className={classNames(
          styles.buttonNoSpacing,
          unreadChats || newRequests ? styles.logoNotification : styles.logoBox,
          {
            [styles.borderTopRight]: toolbarPosition === TOOLBAR_LEFT,
            [styles.borderTopLeft]: toolbarPosition === TOOLBAR_RIGHT,
          },
        )}
        onClick={props.collapseContent}
      >
        <img src="/images/electron/logo_white.svg" alt="logo" />
      </Button>
      <Nav>
        <SingleNavItem
          path="/patients/search"
          icon="search"
          label="Patient search"
          iconType="light"
        />
        <SingleNavItem path="/patients/insight" disabled icon="lightbulb" label="Patient insight" />
        <SingleNavItem path="/patients/list" disabled icon="heart" label="Patient Management" />
        <SingleNavItem
          path="/requests"
          icon="calendar-edit"
          label="Online Requests"
          iconType="regular"
          badge={newRequests}
          active={location.pathname.indexOf('/requests') !== -1}
        />
        <SingleNavItem
          path="/chat"
          icon="comment"
          label="Chat"
          badge={unreadChats}
          active={location.pathname.indexOf('/chat') !== -1}
        />
        <SingleNavItem path="/phone-calls" disabled icon="phone" label="Phone Calls" />
        <SingleNavItem
          path="/waitlist"
          disabled
          icon="clipboard"
          label="Waitlist"
          iconType="light"
        />
        <SingleNavItem path="/marketing" disabled icon="bullhorn" label="Marketing" />
      </Nav>
      <Nav className={styles.bottomNav}>
        <SingleNavItem path="/intercom" label="Intercom" iconImage={intercomIcon} />
        <SingleNavItem path="/shortcuts" label="Shortcuts" iconImage={shortcutIcon} />
        <UserSettings />
      </Nav>
    </div>
  );
}

NavList.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  unreadChats: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  newRequests: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showContent: PropTypes.bool.isRequired,
  toolbarPosition: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_RIGHT]),
  displayContent: PropTypes.func.isRequired,
  collapseContent: PropTypes.func.isRequired,
};

NavList.defaultProps = {
  unreadChats: 0,
  newRequests: 0,
  toolbarPosition: TOOLBAR_LEFT,
};

const mapStateToProps = ({ chat, electron, entities }) => {
  const unreadChatsCount = chat.get('unreadChatsCount');
  const requests = entities.getIn(['requests', 'models']);
  const filteredRequests = requests
    .toArray()
    .filter(req => !req.get('isCancelled') && !req.get('isConfirmed'));

  const chatsLength = unreadChatsCount > 100 ? '99+' : unreadChatsCount;
  const requestsLength = filteredRequests.length > 100 ? '99+' : filteredRequests.length;

  return {
    unreadChats: chatsLength,
    newRequests: requestsLength,
    showContent: electron.get('showContent'),
    toolbarPosition: electron.get('toolbarPosition'),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      displayContent,
      collapseContent,
    },
    dispatch,
  );

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(withAuthProps(NavList));
