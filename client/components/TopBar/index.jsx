
import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import classNames from 'classnames';
import { AppBar, Button, IconButton, Tabs, Tab } from '../library';
import SubTabs from '../SubTabs/index';
import styles from './styles.scss';


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
