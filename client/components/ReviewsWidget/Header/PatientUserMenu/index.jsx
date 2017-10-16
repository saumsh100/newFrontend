
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  DropdownMenu,
  MenuItem,
  Icon,
  Button,
} from '../../../library';
import styles from './styles.scss';

function UserAvatarButton(props) {
  const {
    user
  } = props;

  return (
    <div {...props} className={styles.userMenuButton}>
      <div className={styles.userContainer}>
        <Avatar
          size="sm"
          user={user}
          className={styles.userAvatar}
        />
        <div className={styles.userMenuGreeting}>
          <div className={styles.greeting}>
            {user.firstName + ' ' + user.lastName}
          </div>
        </div>
        <Icon icon="caret-down" className={styles.caretIcon} />
      </div>
    </div>
  );
}

export default class PatientUserMenu extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    alert('Logging out!');
  }

  render() {
    const { user } = this.props;
    const userMenuProps = {
      user
    };

    return (
      <div className={styles.userWrapper}>
        <DropdownMenu labelComponent={props => <UserAvatarButton {...props} {...userMenuProps} />}>
          <MenuItem
            icon="power-off"
            className={styles.userMenuLi}
            onClick={this.logout}
          >
            Sign Out
          </MenuItem>
        </DropdownMenu>
      </div>
    );
  }
}
