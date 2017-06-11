
import React, { PropTypes, Component } from 'react';
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
          avatarUrl: 'https://placeimg.com/80/80/animals',
          firstName: 'Justin',
        }}
      />
      <Icon icon="caret-down" />
    </Button>
  );
};

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
    const { isCollapsed, setIsCollapsed } = this.props;
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
            <li>
              <DropdownMenu labelComponent={UserMenu}>
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
  runOnDemandSync: PropTypes.func.isRequired,
};

export default TopBar;
