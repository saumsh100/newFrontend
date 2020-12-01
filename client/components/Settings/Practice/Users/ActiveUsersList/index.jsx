
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import User from '../../../../../entities/models/User';
import { Avatar, ListItem, IconButton } from '../../../../library';
import { deleteEntityRequest } from '../../../../../thunks/fetchEntities';
import styles from '../styles.scss';
import { MANAGER_ROLE, SUPERADMIN_ROLE, OWNER_ROLE, ADMIN_ROLE } from '../user-role-constants';

class ActiveUsersList extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);
  }

  get editButton() {
    const { currentUserId, userId, role, currentUserRole, edit, userIsSSO } = this.props;

    let allowEdit = false;

    if (currentUserRole === SUPERADMIN_ROLE) {
      allowEdit = true;
    }

    if (currentUserRole === OWNER_ROLE) {
      allowEdit = true;
    }

    if (currentUserRole === ADMIN_ROLE) {
      if (role !== OWNER_ROLE) {
        allowEdit = true;
      }
    }

    allowEdit = allowEdit && !userIsSSO && userId !== currentUserId;

    return (
      allowEdit && (
        <div className={styles.paddingRight}>
          <IconButton icon="pencil" className={styles.edit} onClick={edit}>
            Edit
          </IconButton>
        </div>
      )
    );
  }

  get deleteButton() {
    const { activeUser, role, currentUserRole, userIsSSO } = this.props;

    let allowDelete = false;

    if (currentUserRole === SUPERADMIN_ROLE || currentUserRole === OWNER_ROLE) {
      allowDelete = true;
    }

    if (currentUserRole === ADMIN_ROLE) {
      if (role !== OWNER_ROLE) {
        allowDelete = true;
      }
    }

    allowDelete = allowDelete && !userIsSSO;

    return (
      allowDelete && (
        <IconButton
          icon="trash"
          className={styles.delete}
          onClick={() => this.deleteUser(activeUser.id, activeUser.firstName)}
        >
          Delete
        </IconButton>
      )
    );
  }

  /*
    CRU-1644
    This overrides MANAGER and re-labels it to user. The backend is still using MANAGER, however.
    The constants should also be imported, but they are currently found hardcoded everywhere.
  */
  get roleDisplay() {
    switch (this.props.role) {
      case MANAGER_ROLE:
        return 'USER';
      default:
        return this.props.role;
    }
  }

  deleteUser(id, name) {
    const alert = {
      success: {
        body: 'User Deleted.',
      },
      error: {
        body: 'User Could Not Be Deleted',
      },
    };

    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      this.props.deleteEntityRequest({
        key: 'users',
        id,
        alert,
      });
    }
  }

  render() {
    const { activeUser, currentUserId, userId } = this.props;
    const badge = userId === currentUserId ? <span className={styles.badge}>You</span> : null;

    return (
      <ListItem className={styles.userListItem} data-test-id={activeUser.getName()}>
        <div className={styles.main}>
          <Avatar className={styles.image} user={activeUser} />
          <div className={styles.userName}>
            <div>
              <p className={styles.name}>
                {activeUser.getName()} {badge}
              </p>
            </div>
            <p className={styles.email}>
              {activeUser.getUsername()} - {this.roleDisplay}
            </p>
          </div>
        </div>
        {this.deleteButton}
        {this.editButton}
      </ListItem>
    );
  }
}

ActiveUsersList.propTypes = {
  activeUser: PropTypes.shape(User).isRequired,
  role: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  userIsSSO: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      deleteEntityRequest,
    },
    dispatch,
  );
}

const enhance = connect(
  null,
  mapDispatchToProps,
);

export default enhance(ActiveUsersList);
