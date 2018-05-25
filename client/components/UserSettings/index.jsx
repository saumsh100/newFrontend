
import React from 'react';
import classNames from 'classnames';
import { NavItem, Icon } from '../library';
import { electron } from '../../util/ipc';
import { SHOW_USER_MODAL, HIDE_USER_MODAL, HIDDEN_USER_MODAL } from '../../constants';
import styles from './style.scss';

class UserSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    electron.on(HIDDEN_USER_MODAL, () => {
      this.setState({
        show: false,
      });
    });
  }

  onMouseEnter() {
    electron.send(SHOW_USER_MODAL);
    this.setState({
      show: true,
    });
  }

  onMouseLeave() {
    electron.send(HIDE_USER_MODAL);
  }

  render() {
    const navStyle = !this.state.show ? styles.navItem : classNames(styles.navItem, styles.active);

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <NavItem className={navStyle} id="user-management">
          <Icon icon="user" className={styles.icon} size={1.3} type="solid" />
        </NavItem>
      </div>
    );
  }
}

export default UserSettings;
