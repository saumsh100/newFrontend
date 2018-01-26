
import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import omit from 'lodash/omit';
import {
  AppBar,
  Avatar,
  Button,
  DropdownMenu,
  Icon,
  IconButton,
  Link,
  MenuItem,
  MenuSeparator,
} from '../library';
import withAuthProps from '../../hocs/withAuthProps';
import styles from './styles.scss';

const UserMenu = (props) => {
  const {
    user,
    role,
    activeAccount,
    enterprise,
  } = props;

  const newProps = omit(props, ['user', 'activeAccount', 'enterprise']);
  // TODO: create a separate container for this to load in user data from 'currentUser'
  const isEnterprise = role === 'SUPERADMIN';//enterprise.get('plan') === 'ENTERPRISE' && (role === 'OWNER' || role === 'SUPERADMIN');
  const businessName = isEnterprise ?
    enterprise.get('name') :
    activeAccount && activeAccount.name;

  return (
    <Button flat {...newProps} className={styles.userMenuButton}>
      <div className={styles.userContainer}>
        <div className={styles.userMenuGreeting}>
          <div className={styles.greeting}>
            Hello, {user.get('firstName')}
          </div>
          <div className={styles.userRole}>
            {role}
          </div>
          <div className={styles.businessName}>
            {businessName}
          </div>
        </div>
        <Avatar
          className={styles.userAvatar}
          user={user.toJS()}
        />
        <Icon icon="caret-down" type="solid" />
      </div>
    </Button>
  );
};

const ActiveAccountButton = ({ account, onClick }) =>
  <div onClick={onClick} className={styles.activeAccountButton}>
    <span className={styles.activeAccountTitle}>{ account.name }</span>
    <Icon icon="caret-down" type="solid" />
  </div>;

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.sync = this.sync.bind(this);
  }

  sync(e) {
    e.preventDefault();
    this.props.runOnDemandSync();
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
    } = this.props;

    // TODO: for some reason the DashbaordApp Container renders even if not logged in...
    if (!isAuth) return null;

    const topBarClassName = classNames(
      styles.topBarContainer,
      isCollapsed ?
        styles.topBarContainerCollapsed :
        styles.topBarContainerUnCollapsed
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
      <div className={!isCollapsed ? styles.logoWrapper : styles.logoWrapperCollapsed}>
        <div className={!isCollapsed ? styles.logoImage : styles.logoImageCollapsed}>
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
          className={(isActive ? styles.menuItemSelected : false)}
          onClick={isActive ? false : setActive}
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

    return (
      <AppBar className={topBarClassName}>
        {logoComponent}
        <IconButton
          icon="bars"
          className={styles.hamburger}
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={styles.rightOfBar}>
          <ul className={styles.pillsList}>
            {withEnterprise && activeAccount ?
              <li>
                <DropdownMenu
                  labelComponent={ActiveAccountButton}
                  labelProps={{ account: activeAccount }}
                >
                  <div style={{ width: '200px' }}>
                    {accounts.map(renderAccountItem)}
                  </div>
                </DropdownMenu>
              </li> :
              null
            }
            <li>
              <DropdownMenu labelComponent={props => <UserMenu {...props} {...userMenuProps} />}>
                <Link to="/profile">
                  <MenuItem className={styles.userMenuLi} icon="user">User Profile</MenuItem>
                </Link>
                <Link to="/settings">
                  <MenuItem className={styles.userMenuLi} icon="cogs">Account Settings</MenuItem>
                </Link>
                <MenuItem className={styles.userMenuLi} icon="power-off" onClick={this.props.logout}>Sign Out</MenuItem>
              </DropdownMenu>
            </li>
            <li className={styles.logoutPill}>
              <IconButton onClick={this.props.logout} icon="power-off" />
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default withAuthProps(withRouter(TopBar));
