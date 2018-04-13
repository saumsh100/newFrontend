
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import { Avatar, DropdownMenu, MenuItem, Icon } from '../../../library';
import * as AuthThunks from '../../../../thunks/patientAuth';
import styles from './styles.scss';

const UserAvatarButton = (props) => {
  const { user } = props;

  const finalProps = omit(props, 'user');

  return (
    <div {...finalProps} className={styles.userMenuButton}>
      <div className={styles.userContainer}>
        <Avatar
          size="sm"
          user={user}
          className={styles.userAvatar}
        />
        <div className={styles.userMenuGreeting}>
          <div className={styles.greeting}>
            {`${user.firstName} ${user.lastName}`}
          </div>
        </div>
        <Icon
          icon="caret-down"
          type="solid"
          className={styles.caretIcon}
        />
      </div>
    </div>
  );
};

class PatientUserMenu extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout();
  }

  render() {
    const userMenuProps = { user: this.props.user };

    return (
      <div className={styles.userWrapper}>
        <DropdownMenu
          labelComponent={props => (
            <UserAvatarButton {...props} {...userMenuProps} />
          )}
          className={styles.dropdownUserMenu}
        >
          <MenuItem
            onClick={this.logout}
            icon="power-off"
            className={styles.userMenuLi}
          >
            Sign Out
          </MenuItem>
        </DropdownMenu>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: AuthThunks.logout,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(PatientUserMenu);

PatientUserMenu.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.object,
};

UserAvatarButton.propTypes = {
  user: PropTypes.object,
};
