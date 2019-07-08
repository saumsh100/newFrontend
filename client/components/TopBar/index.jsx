
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Map } from 'immutable';
import classNames from 'classnames';
import {
  AppBar,
  Avatar,
  Button,
  DropdownMenu,
  Icon,
  IconButton,
  Link,
  MenuItem,
} from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import GraphQLPatientSearch from '../GraphQLPatientSearch';
import accountShape from '../library/PropTypeShapes/accountShape';
import styles from './styles.scss';
import EnabledFeature from '../library/EnabledFeature';

const UserMenu = ({
  user,
  activeAccount,
  enterprise,
  role,
  multipleAccounts,
  ...props
}) => {
  const isEnterprise =
    multipleAccounts && (role === 'OWNER' || role === 'SUPERADMIN');
  const businessName = isEnterprise
    ? enterprise.get('name')
    : activeAccount && activeAccount.name;

  return (
    <Button flat {...props} className={styles.userMenuButton}>
      <div className={styles.userContainer}>
        <div className={styles.userMenuGreeting}>
          <div className={styles.greeting}>Hello, {user.get('firstName')}</div>
          <div className={styles.businessName}>{businessName}</div>
        </div>
        <Avatar
          className={styles.userAvatar}
          user={user.toJS()}
          isPatient={false}
          size="sm"
        />
        <Icon icon="caret-down" type="solid" />
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
  account: PropTypes.shape({ id: PropTypes.string }).isRequired,
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
      setIsCollapsed,
      accounts,
      activeAccount,
      location,
      withEnterprise,
      enterprise,
      user,
      role,
      isAuth,
      isSearchCollapsed,
    } = this.props;

    // TODO: for some reason the DashbaordApp Container renders even if not logged in...
    if (!isAuth) return null;

    const topBarClassName = classNames(
      styles.topBarContainer,
      isCollapsed
        ? styles.topBarContainerCollapsed
        : styles.topBarContainerUnCollapsed,
    );

    // Conditionally change the image render ifCollapsed, media queries will decide to hide or not
    let logoImage = (
      <img
        className={styles.logoImageImage}
        src="/images/carecru_logo.png"
        alt="CareCru logo"
      />
    );

    if (isCollapsed) {
      logoImage = (
        <img
          className={styles.logoImageImageCollapsed}
          src="/images/carecru_logo_collapsed.png"
          alt="CareCru logo"
        />
      );
    }

    const logoComponent = (
      <div
        className={
          !isCollapsed ? styles.logoWrapper : styles.logoWrapperCollapsed
        }
      >
        <div
          className={
            !isCollapsed ? styles.logoImage : styles.logoImageCollapsed
          }
        >
          {logoImage}
        </div>
      </div>
    );

    const renderAccountItem = (account) => {
      const isActive = account.id === activeAccount.id;
      const setActive = () => {
        this.props.switchActiveAccount(account.id, location.pathname);
      };

      return (
        <MenuItem
          key={account.id}
          className={isActive ? styles.menuItemSelected : null}
          onClick={isActive ? false : setActive}
          data-test-id={`option_${account.name}`}
        >
          {account.name}
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

    return (
      <AppBar className={topBarClassName}>
        {logoComponent}
        <IconButton
          icon="bars"
          className={styles.hamburger}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={styles.rightContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.wrapper}>
              <IconButton
                icon="search"
                className={classNames({
                  [styles.searchIconWrapper]: true,
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
                  subPredicate &&
                  (accounts.length > 1 && withEnterprise && !!activeAccount);

                const shouldShowOwner = shouldShow(
                  userRole === 'OWNER' &&
                    flags.get('show-account-switcher-to-owners'),
                );

                const shouldShowSuperAdmin = shouldShow(
                  userRole === 'SUPERADMIN',
                );

                return shouldShowOwner || shouldShowSuperAdmin;
              }}
              render={
                <li data-test-id="dropDown_accounts">
                  <DropdownMenu
                    className={styles.accountsDropdownMenu}
                    labelComponent={ActiveAccountButton}
                    labelProps={{ account: activeAccount }}
                  >
                    <div>{accounts.map(renderAccountItem)}</div>
                  </DropdownMenu>
                </li>
              }
            />
            <li>
              <DropdownMenu
                className={styles.userDropdownMenu}
                labelComponent={props => (
                  <EnabledFeature
                    predicate={() => true}
                    render={({ userRole, flags }) => {
                      const shouldShow = (subPredicate = true) =>
                        subPredicate && accounts.length > 1;

                      const shouldShowOwner = shouldShow(
                        userRole === 'OWNER' &&
                          flags.get('show-account-switcher-to-owners'),
                      );

                      const shouldShowSuperAdmin = shouldShow(
                        userRole === 'SUPERADMIN',
                      );

                      return (
                        <UserMenu
                          multipleAccounts={
                            shouldShowOwner || shouldShowSuperAdmin
                          }
                          {...props}
                          {...userMenuProps}
                        />
                      );
                    }}
                  />
                )}
              >
                <Link to="/profile">
                  <MenuItem className={styles.userMenuLi} icon="user">
                    User Profile
                  </MenuItem>
                </Link>
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
            </li>
          </ul>
        </div>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  switchActiveAccount: PropTypes.func.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  push: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  accounts: PropTypes.arrayOf(Object).isRequired,
  enterprise: PropTypes.instanceOf(Map).isRequired,
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  activeAccount: PropTypes.shape(accountShape),
  runOnDemandSync: PropTypes.func.isRequired,
  withEnterprise: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool,
};

TopBar.defaultProps = {
  isAuth: false,
  activeAccount: {},
};

export default withAuthProps(withRouter(TopBar));
