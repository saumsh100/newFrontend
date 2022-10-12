import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import classNames from 'classnames';
import {
  AppBar,
  Avatar,
  DropdownMenu,
  Icon,
  IconButton,
  Link,
  MenuItem,
  StandardButton as Button,
} from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import GraphQLPatientSearch from '../GraphQLPatientSearch';
import accountShape from '../library/PropTypeShapes/accountShape';
import EnabledFeature from '../library/EnabledFeature';
import AdaptiveLogo from './AdaptiveLogo';
import MyFollowUpsButton from './MyFollowUpsButton';
import styles from './reskin-styles.scss';
import FormNotificationsButton from './FormNotificationsButton';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

const UserMenu = ({ user, activeAccount, enterprise, role, multipleAccounts, ...props }) => {
  const isEnterprise = multipleAccounts && (role === 'OWNER' || role === 'SUPERADMIN');
  const businessName = isEnterprise ? enterprise.get('name') : activeAccount && activeAccount.name;

  return (
    <Button flat {...props} className={styles.userMenuButton}>
      <div className={styles.userContainer}>
        <Avatar className={styles.userAvatar} user={user.toJS()} isPatient={false} size="sm" />
        <div className={styles.userMenuGreeting}>
          <div className={styles.greeting}>Hello, {user.get('firstName')}</div>
          <div className={styles.businessName}>{businessName}</div>
        </div>
        <Icon icon="caret-down" type="solid" className={styles.userMenuIcon} />
      </div>
    </Button>
  );
};

UserMenu.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  activeAccount: PropTypes.shape(accountShape),
  enterprise: PropTypes.instanceOf(Map).isRequired,
  multipleAccounts: PropTypes.bool.isRequired,
};

UserMenu.defaultProps = { activeAccount: {} };

const ActiveAccountButton = ({ account, onClick }) => (
  <Button onClick={onClick} className={styles.activeAccountButton}>
    <span className={styles.activeAccountTitle}>{account.name}</span>
    <Icon icon="caret-down" type="solid" />
  </Button>
);

ActiveAccountButton.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.onSearchSelect = this.onSearchSelect.bind(this);
    this.sync = this.sync.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
  }

  onSearchSelect(patient) {
    document.getElementById('topBarPatientSearch').value = '';
    this.props.push(`/patients/${patient.ccId}`);
    this.closeSearch();
  }

  sync(e) {
    e.preventDefault();
    this.props.runOnDemandSync();
  }

  openSearch() {
    this.props.setIsSearchCollapsed({ isCollapsed: false });
  }

  closeSearch() {
    this.props.setIsSearchCollapsed({ isCollapsed: true });
  }

  render() {
    const {
      isCollapsed,
      isHovered,
      setIsCollapsed,
      setIsHovered,
      location,
      withEnterprise,
      enterprise,
      user,
      role,
      isAuth,
      isSearchCollapsed,
      isSuperAdmin,
      accountsFlagMap,
      enterpriseAccountsMap,
      activeAccountMap,
      enterpriseManagementAuthenticationActive,
      allNotificationsCount,
    } = this.props;

    const allowedAccounts = accountsFlagMap && accountsFlagMap.toJS().map((a) => a.value);
    const enterpriseAccounts = Object.values(enterpriseAccountsMap.toJS()) || [];
    const accountsList =
      allowedAccounts.length > 0
        ? enterpriseAccounts.filter((a) => allowedAccounts.indexOf(a.id) > -1)
        : enterpriseAccounts;
    const accounts = isSuperAdmin ? enterpriseAccounts : accountsList;

    const activeAccount = activeAccountMap && activeAccountMap.toJS();

    if (!isAuth) return null;

    const topBarClassName = classNames(
      styles.topBarContainer,
      isCollapsed ? styles.topBarContainerCollapsed : styles.topBarContainerUnCollapsed,
    );

    const renderAccountItem = ({ name, id }) => {
      const isActive = id === activeAccount.id;
      const setActive = () => {
        !isActive && this.props.switchActiveAccount(id, location.pathname);
      };

      return (
        <MenuItem
          key={id}
          className={isActive ? styles.menuItemSelected : null}
          onClick={setActive}
          data-test-id={`option_${name}`}
        >
          {name}
        </MenuItem>
      );
    };

    const userMenuProps = {
      user,
      activeAccount,
      enterprise,
      role,
    };

    const patientSearchInputProps = {
      placeholder: 'Search',
      id: 'topBarPatientSearch',
      onBlur: this.closeSearch,
    };

    const searchTheme = {
      group: classNames(styles.searchTheme, {
        [styles.animateSearch]: !isSearchCollapsed,
      }),
      bar: styles.barStyle,
      container: styles.patientSearchClass,
      suggestionsContainerOpen: styles.containerOpen,
      suggestionsList: styles.suggestionsList,
    };

    const handleHamburgerButtonClick = () => {
      setIsCollapsed(!isCollapsed);
      setIsHovered(false);
    };

    return (
      <AppBar className={topBarClassName}>
        {!isCollapsed ? (
          <>
            <AdaptiveLogo description="CareCru logo" isCollapsed={isCollapsed} />
            <div className={styles.fullVerticalDivider} />
            <Button variant="flat" onClick={() => setIsCollapsed(!isCollapsed)}>
              <img src="/images/icons/chevrons-left.svg" alt="collapse side menu" />
            </Button>
          </>
        ) : (
          <div className={styles.menuButtonContainer}>
            <Button
              variant="flat"
              onClick={handleHamburgerButtonClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              icon={isHovered ? null : 'bars'}
              className={styles.collapseButton}
            >
              {allNotificationsCount > 0 && (
                <span className={styles.menuButtonBadge}>{allNotificationsCount}</span>
              )}
              {isHovered && (
                <img
                  src="/images/icons/chevrons-left.svg"
                  alt="expand side menu"
                  className={styles.invert180degrees}
                />
              )}
            </Button>
            <AdaptiveLogo description="CareCru logo" isCollapsed={isCollapsed} />
          </div>
        )}
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <div
              className={classNames(styles.wrapper, {
                [styles.openWrapper]: !this.props.isSearchCollapsed,
              })}
            >
              <IconButton
                icon="search"
                topBarSearch
                className={classNames(styles.searchIconWrapper, {
                  [styles.iconSearchOpen]: !isSearchCollapsed,
                })}
                iconClassName={styles.searchIcon}
                onClick={this.openSearch}
              />
              {!this.props.isSearchCollapsed && (
                <GraphQLPatientSearch
                  focusInputOnMount
                  context="topBar"
                  hideRecentSearch={false}
                  onChange={this.onSearchSelect}
                  inputProps={patientSearchInputProps}
                  theme={searchTheme}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.rightOfBar}>
          <ul className={styles.pillsList}>
            <EnabledFeature
              drillProps={false}
              predicate={({ flags, userRole }) => {
                // I know it is kinda wet but I'd rather keep it more legible for now
                const shouldShow = (subPredicate = true) =>
                  subPredicate && accounts.length > 1 && withEnterprise && !!activeAccount;

                const shouldShowOwner = shouldShow(
                  userRole === 'OWNER' && flags.get('show-account-switcher-to-owners'),
                );

                const shouldShowSuperAdmin = shouldShow(userRole === 'SUPERADMIN');

                return shouldShowOwner || shouldShowSuperAdmin;
              }}
              render={
                <li data-test-id="dropDown_accounts" className={styles.dropDownAccountLi}>
                  <DropdownMenu
                    className={styles.accountsDropdownMenu}
                    labelComponent={ActiveAccountButton}
                    labelProps={{ account: activeAccount }}
                  >
                    <div>{accounts.map(renderAccountItem)}</div>
                  </DropdownMenu>
                  <div className={styles.verticalDivider} />
                </li>
              }
            />
            <li className={styles.dropDownAccountLi}>
              <DropdownMenu
                className={styles.userDropdownMenu}
                labelComponent={(props) => (
                  <EnabledFeature
                    predicate={() => true}
                    render={({ userRole, flags }) => {
                      const shouldShow = (subPredicate = true) =>
                        subPredicate && accounts.length > 1;

                      const shouldShowOwner = shouldShow(
                        userRole === 'OWNER' && flags.get('show-account-switcher-to-owners'),
                      );

                      const shouldShowSuperAdmin = shouldShow(userRole === 'SUPERADMIN');

                      return (
                        <UserMenu
                          multipleAccounts={shouldShowOwner || shouldShowSuperAdmin}
                          {...props}
                          {...userMenuProps}
                        />
                      );
                    }}
                  />
                )}
              >
                {!user.get('isSSO') && !enterpriseManagementAuthenticationActive && (
                  <Link to="/profile">
                    <MenuItem className={styles.userMenuLi} icon="user">
                      User Profile
                    </MenuItem>
                  </Link>
                )}
                <Link to="/settings">
                  <MenuItem className={styles.userMenuLi} icon="cogs">
                    Account Settings
                  </MenuItem>
                </Link>
                <MenuItem
                  className={styles.userMenuLi}
                  icon="power-off"
                  onClick={this.props.logout}
                >
                  Sign Out
                </MenuItem>
              </DropdownMenu>
              <div className={styles.verticalDivider} />
            </li>
            <EnabledFeature
              predicate={({ flags }) => flags.get('use-form-submission')}
              render={() => (
                <li>
                  <FormNotificationsButton />
                </li>
              )}
            />
            <EnabledFeature
              predicate={({ flags }) => flags.get('follow-ups-shortcut-icon')}
              render={() => (
                <li>
                  <MyFollowUpsButton />
                </li>
              )}
            />
          </ul>
        </div>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  enterpriseManagementAuthenticationActive: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  switchActiveAccount: PropTypes.func.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  push: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  enterprise: PropTypes.instanceOf(Map).isRequired,
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  runOnDemandSync: PropTypes.func.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool,
  isSuperAdmin: PropTypes.bool,
  activeAccountMap: PropTypes.instanceOf(Map),
  accountsFlagMap: PropTypes.instanceOf(Map).isRequired,
  enterpriseAccountsMap: PropTypes.instanceOf(Map).isRequired,
  isHovered: PropTypes.bool.isRequired,
  allNotificationsCount: PropTypes.number.isRequired,
};

TopBar.defaultProps = {
  isAuth: false,
  isSuperAdmin: false,
  activeAccountMap: null,
};

const mapStateToProps = ({ featureFlags, toolbar, chat, entities, waitingRoom }) => {
  const onlineRequests = entities.getIn(['requests', 'models']);
  const unreadChatMessagesLength = chat.get('unreadChatsCount');
  const canSeeVirtualWaitingRoom = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'virtual-waiting-room-ui',
  );
  const waitingRoomQueue = waitingRoom.get('waitingRoomQueue');
  const waitingRoomQueueLength =
    waitingRoomQueue && canSeeVirtualWaitingRoom ? waitingRoomQueue.length : 0;
  const filteredRequests = onlineRequests
    .toArray()
    .filter((req) => !req.get('isCancelled') && !req.get('isConfirmed'));

  const allNotificationsCount =
    waitingRoomQueueLength + unreadChatMessagesLength + filteredRequests.length;

  return {
    allNotificationsCount: allNotificationsCount > 99 ? '99+' : allNotificationsCount,
    enterpriseManagementAuthenticationActive: featureFlags.getIn([
      'flags',
      'enterprise-management-authentication',
    ]),
    isHovered: toolbar.get('isHovered'),
  };
};

export default withAuthProps(withRouter(connect(mapStateToProps)(TopBar)));
