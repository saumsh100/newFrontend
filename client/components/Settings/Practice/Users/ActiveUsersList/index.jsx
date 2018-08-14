
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Avatar, ListItem, Button, IconButton } from '../../../../library';
import { deleteEntityRequest } from '../../../../../thunks/fetchEntities';
import styles from '../styles.scss';

class ActiveUsersList extends Component {
  constructor(props) {
    super(props);

    this.deleteUser = this.deleteUser.bind(this);
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

    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.props.deleteEntityRequest({ key: 'users', id, alert });
    }
  }

  render() {
    const {
      activeUser,
      role,
      currentUserId,
      userId,
      currentUserRole,
      edit,
    } = this.props;
    const badge =
      userId === currentUserId ? (
        <span className={styles.badge}>You</span>
      ) : null;
    let button = null;
    if (
      (currentUserRole === 'SUPERADMIN' || currentUserRole === 'OWNER') &&
      role !== 'SUPERADMIN'
    ) {
      button =
        userId !== currentUserId ? (
          <div className={styles.paddingRight}>
            <IconButton icon="pencil" className={styles.edit} onClick={edit}>
              Edit
            </IconButton>
          </div>
        ) : null;
    }

    const check =
      (currentUserRole === 'SUPERADMIN' || currentUserRole === 'OWNER') &&
      (role !== 'SUPERADMIN' && role !== 'OWNER');

    const deleteMe = check ? (
      <IconButton
        icon="trash"
        className={styles.delete}
        onClick={() => this.deleteUser(activeUser.id, activeUser.firstName)}
      >
        Delete
      </IconButton>
    ) : null;

    return (
      <ListItem
        className={styles.userListItem}
        data-test-id={activeUser.getName()}
      >
        <div className={styles.main}>
          <Avatar className={styles.image} user={activeUser} />
          <div className={styles.userName}>
            <div>
              <p className={styles.name}>
                {activeUser.getName()} {badge}
              </p>
            </div>
            <p className={styles.email}>
              {activeUser.getUsername()} - {role}
            </p>
          </div>
        </div>
        {deleteMe}
        {button}
      </ListItem>
    );
  }
}

ActiveUsersList.propTypes = {
  activeUser: PropTypes.object,
  role: PropTypes.string,
  currentUserId: PropTypes.string,
  userId: PropTypes.string,
  currentUserRole: PropTypes.string,
  edit: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
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
