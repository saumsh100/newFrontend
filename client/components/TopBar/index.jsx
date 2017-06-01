
import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router-dom';
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
  MenuSeparator,
} from '../library';
import styles from './styles.scss';

const UserMenu = (props) => {
  // TODO: create a separate container for this to load in user data from 'currentUser'
  return (
    <Button flat {...props} className={styles.userMenuButton}>
      <div className={styles.userMenuGreeting}>
        <span>Hello Corina,</span>
        <br />
        <span className={styles.userRole}>Office Manager</span>
      </div>
      <Avatar
        className={styles.userAvatar}
        user={{
          url: 'https://placeimg.com/80/80/animals',
          firstName: 'Test',
        }}
      />
      <Icon icon="caret-down" />
    </Button>
  );
};

const ActiveAccountButton = ({ account, onClick }) =>
  <div onClick={onClick} className={styles.activeAccountButton}>
    <span className={styles.activeAccountTitle}>{ account.name }</span>
    <Icon icon="caret-down" />
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
    } = this.props;

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

            {activeAccount ?
              <li>
                <DropdownMenu
                  labelComponent={ActiveAccountButton}
                  labelProps={{ account: activeAccount }}
                >
                  {accounts.map(renderAccountItem)}
                </DropdownMenu>
              </li> :
              null
            }

            <li>
              <IconButton icon="heart" onClick={() => alert('Implement Sharing')} />
            </li>
            <li>
              <IconButton icon="bell" onClick={() => alert('Implement Notifications')} />
            </li>
            <li>
              <IconButton icon="comments" onClick={() => alert('Implement Messages')} />
            </li>
            <li>
              <IconButton
                icon="refresh"
                onClick={this.sync}
              />
            </li>
            <li>
              <DropdownMenu labelComponent={UserMenu}>
                <Link to="/profile"><MenuItem icon="user">User Profile</MenuItem></Link>
                <Link to="/settings"><MenuItem icon="cogs">Account Settings</MenuItem></Link>
                <MenuSeparator />
                <MenuItem icon="power-off" onClick={this.props.logout}>Sign Out</MenuItem>
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
  runOnDemandSync: PropTypes.func.isRequired,
  switchActiveAccount: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default withRouter(TopBar);
