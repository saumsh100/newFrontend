
import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import {
  AppBar,
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
  return (
    <Button flat {...props} className={styles.userMenuButton}>
      <div className={styles.userMenuGreeting}>
        <span>Hello Corina,</span>
        <br/>
        <span className={styles.userRole}>Office Manager</span>
      </div>
      <Icon icon="caret-down" />
    </Button>
  );
};

class TopBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.setItem('token', '');
    browserHistory.push('/login');
    this.props.logout();
  }

  render() {
    const { isCollapsed, setIsCollapsed } = this.props;
    const topBarClassName = classNames(
      styles.topBarContainer,
      isCollapsed ?
        styles.topBarContainerCollapsed :
        styles.topBarContainerUnCollapsed
    );

    let logoComponent = null;
    if (!isCollapsed) {
      logoComponent = (
        <div className={styles.logoWrapper}>
          <div className={styles.logoImage}>
            <img
              className={styles.logoImageImage}
              src="/images/carecru_logo.png"
              alt="CareCru logo"
            />
          </div>
        </div>
      );
    }

    return (
      <AppBar className={topBarClassName}>
        {logoComponent}
        <div className={styles.leftOfBar}>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)} icon="bars" />
        </div>
        <div className={styles.subTabs}>

        </div>
        <div className={styles.rightOfBar}>
          <ul className={styles.pillsList}>
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
              <DropdownMenu labelComponent={UserMenu}>
                <Link to="/profile"><MenuItem icon="user">User Profile</MenuItem></Link>
                <Link to="/settings"><MenuItem icon="cogs">Account Settings</MenuItem></Link>
                <MenuSeparator />
                <MenuItem icon="power-off" onClick={this.logout}>Sign Out</MenuItem>
              </DropdownMenu>
            </li>
            <li className={styles.logoutPill}>
              <IconButton onClick={this.logout} icon="power-off" />
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
};

export default TopBar;
