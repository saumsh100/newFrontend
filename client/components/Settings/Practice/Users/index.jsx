
import { sortDesc } from '@carecru/isomorphic';
import Map from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';

import {
  createEntityRequest,
  deleteEntityRequest,
  fetchEntities,
  updateEntityRequest,
} from '../../../../thunks/fetchEntities';
import { Button, DialogBox, Header, List, Row } from '../../../library';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import SettingsCard from '../../Shared/SettingsCard';
import ActiveUsersList from './ActiveUsersList';
import EditUserForm from './EditUserForm';
import InviteUserForm from './InviteUserForm';
import InviteUsersList from './InviteUsersList';
import NewUserForm from './NewUserForm';
import { ADMIN_ROLE, OWNER_ROLE, SUPERADMIN_ROLE } from './user-role-constants';
import styles from './styles.scss';

const getUsersWithPermissions = usr => (permissions, editPermissionId) => {
  const usrPermission = permissions.get(usr.permissionId);
  return (
    usrPermission && editPermissionId === usrPermission && usrPermission.get('role') === OWNER_ROLE
  );
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      editActive: false,
      newActive: false,
      editUserId: null,
      editValue: 'VIEWER',
      roleChange: {},
    };

    this.deleteInvite = this.deleteInvite.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.addUser = this.addUser.bind(this);
    this.sendNewUser = this.sendNewUser.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.editUser = this.editUser.bind(this);
    this.editDropdown = this.editDropdown.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
  }

  componentDidMount() {
    const { accountId, role } = this.props;
    const urlInvites = `/api/accounts/${accountId}/invites`;

    this.props.fetchEntities({ url: urlInvites });

    this.setState({ role });
  }

  get addUserButton() {
    return this.props.role === SUPERADMIN_ROLE ||
      this.props.role === OWNER_ROLE ||
      this.props.role === ADMIN_ROLE ? (
      <Button
        className={styles.inviteUser}
        onClick={this.addNewUser}
        data-test-id="addUserButton"
        secondary
      >
        Add a User
      </Button>
      ) : null;
  }

  deleteInvite(id) {
    const { accountId } = this.props;

    const alert = {
      success: { body: 'Invite Deleted.' },
      error: { body: 'Invite Could Not Be Deleted' },
    };

    const url = `/api/accounts/${accountId}/invites/${id}`;
    this.props.deleteEntityRequest({
      key: 'invites',
      id,
      url,
      alert,
    });
  }

  sendNewUser(entityData) {
    const { accountId, userId } = this.props;

    const url = `/api/accounts/${accountId}/newUser/`;
    entityData.accountId = accountId;
    entityData.sendingUserId = userId;

    this.setState({ newActive: false });

    const alert = {
      success: { body: 'User Created.' },
      error: { body: 'User Could Not Be Created' },
    };

    this.props
      .createEntityRequest({
        key: 'user',
        entityData,
        url,
        alert,
      })
      .then(() => this.props.reset('newUser'));
  }

  sendInvite(entityData) {
    const { accountId, userId } = this.props;

    const url = `/api/accounts/${accountId}/invites/`;
    entityData.accountId = accountId;
    entityData.sendingUserId = userId;

    this.setState({ active: false });

    const alert = {
      success: { body: 'Invite Sent.' },
      error: { body: 'Invite Could Not Be Sent' },
    };

    this.props
      .createEntityRequest({
        key: 'invites',
        entityData,
        url,
        alert,
      })
      .then(() => this.props.reset('emailInvite'));
  }

  sendEdit({ role, sendBookingRequestEmail, isSSO, username }) {
    this.setState({ editActive: false });
    const selectedUser = this.props.users.get(this.state.editUserId);
    const selectedUserPermission = this.props.permissions.get(selectedUser.get('permissionId'));

    if (
      selectedUser.get('sendBookingRequestEmail') !== sendBookingRequestEmail ||
      selectedUser.get('isSSO') !== isSSO ||
      selectedUser.get('username') !== username
    ) {
      const alert = {
        success: { body: 'Updated User.' },
        error: { body: 'User Could Not Be Updated' },
      };

      this.props.updateEntityRequest({
        key: 'user',
        values: { sendBookingRequestEmail,
          isSSO,
          username },
        url: `/api/users/${this.state.editUserId}/preferences`,
        alert,
      });
    }

    if (selectedUserPermission.get('role') !== role) {
      const url = `/api/accounts/${this.props.accountId}/permissions/${
        this.state.editPermissionId
      }`;

      const usersWithPermissions = this.props.users.filter(
        getUsersWithPermissions(this.props.permissions, this.state.editPermissionId),
      );

      if (usersWithPermissions.size === 1) {
        alert('There must be one Owner!');
      } else {
        const alert = {
          success: { body: 'Permission Changed.' },
          error: { body: 'Permission Could Not Be Changed' },
        };

        this.props.updateEntityRequest({
          key: 'accounts',
          values: { role },
          url,
          alert,
        });
      }
    }
  }

  reinitializeState() {
    const newState = {
      active: false,
      editActive: false,
      newActive: false,
      roleChange: this.state.roleChange,
      editUserId: null,
    };

    newState.roleChange[this.state.userEdit] = this.state.editValue;

    this.setState(newState);
  }

  addUser() {
    this.setState({ active: true });
  }

  addNewUser() {
    this.setState({ newActive: true });
  }

  editUser(editUserId, editPermissionId, role, i) {
    if (this.state.roleChange[i]) {
      role = this.state.roleChange[i];
    }
    this.setState({
      editActive: true,
      editUserId,
      editPermissionId,
      editValue: role,
      userEdit: i,
      roleChange: this.state.roleChange,
    });
  }

  editDropdown(value) {
    this.setState({ editValue: value });
  }

  render() {
    const formName = 'emailInvite';
    const { users, permissions, role, invites, practiceName, userIsSSO } = this.props;
    const { active, editActive, newActive } = this.state;

    let usersInvited = (
      <div className={styles.userListItem}>
        <div className={styles.main}>
          <p className={styles.name}>Users you have invited will show up here.</p>
        </div>
      </div>
    );

    if (invites.size !== 0) {
      usersInvited = invites
        .toArray()
        .map(invite => (
          <InviteUsersList
            key={invite.id}
            id={invite.id}
            email={invite.get('email')}
            currentUserRole={this.state.role}
            date={invite.get('createdAt')}
            onDelete={() => this.deleteInvite(invite.get('id'))}
            mainStyle={styles.main}
            nameStyle={styles.name}
            emailStyle={styles.email}
            userListStyle={styles.userListItem}
            editStyles={styles.cancel}
            userIsSSO={userIsSSO}
          />
        ));
    }

    const actions = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.sendInvite,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: formName,
        },
      },
    ];

    const actionsNewUser = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.sendNewUser,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: 'newUser',
        },
      },
    ];

    const editActions = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: `${this.state.editUserId}_editUserForm`,
        },
      },
    ];

    return (
      <SettingsCard title="Users" bodyClass={styles.usersBodyClass}>
        <DialogBox
          actions={actions}
          title="Email Invite"
          type="small"
          active={active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          data-test-id="inviteUserDialog"
        >
          <InviteUserForm
            mainStyle={styles.emailInvite}
            formStyle={styles.form}
            sendInvite={this.sendInvite}
            formName={formName}
            currentUserRole={role}
          />
        </DialogBox>
        <DialogBox
          actions={actionsNewUser}
          title="Create New User"
          type="small"
          active={newActive}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
          data-test-id="newUserDialog"
        >
          <NewUserForm
            mainStyle={styles.emailInvite}
            formStyle={styles.form}
            sendNewUser={this.sendNewUser}
            formName="newUser"
            currentUserRole={role}
          />
        </DialogBox>
        <DialogBox
          actions={editActions}
          title="Edit User"
          type="small"
          active={editActive}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          {this.state.editUserId && this.state.editPermissionId && (
            <EditUserForm
              user={users.get(this.state.editUserId)}
              role={permissions.get(this.state.editPermissionId).get('role')}
              currentUserRole={role}
              onSubmit={this.sendEdit}
            />
          )}
        </DialogBox>
        <Row className={styles.mainHead}>
          <Header className={styles.header} contentHeader title={`Users in ${practiceName}`} />
          <div className={styles.buttonContainer}>
            {this.addUserButton}
            {!userIsSSO && (
              <Button
                className={styles.inviteUser}
                onClick={this.addUser}
                data-test-id="inviteUserButton"
                secondary
              >
                Invite a User
              </Button>
            )}
          </div>
        </Row>
        <List className={styles.userList} data-test-id="activeUsersList">
          {users
            .toArray()
            .sort(sortDesc)
            .map((user, i) => {
              const permission = permissions.get(user.permissionId);
              if (!permission) {
                return null;
              }
              return (
                <ActiveUsersList
                  userIsSSO={userIsSSO}
                  key={user.id}
                  activeUser={user}
                  role={permission.get('role')}
                  currentUserId={this.state.userId}
                  userId={user.get('id')}
                  currentUserRole={this.state.role}
                  edit={() =>
                    this.editUser(user.get('id'), permission.get('id'), permission.get('role'), i)
                  }
                />
              );
            })}
        </List>
        <Row className={styles.mainHeadInvites}>
          <Header className={styles.header} contentHeader title="Pending Invitations" />
        </Row>
        <List className={styles.userList}>{usersInvited}</List>
      </SettingsCard>
    );
  }
}

Users.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userIsSSO: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  practiceName: PropTypes.string,
  users: PropTypes.instanceOf(Map).isRequired,
  permissions: PropTypes.instanceOf(Map).isRequired,
  invites: PropTypes.instanceOf(Map).isRequired,
};

Users.defaultProps = {
  practiceName: '',
};

function mapStateToProps({ entities, auth }) {
  return {
    accountId: auth.get('accountId'),
    userId: auth.getIn(['user', 'id']),
    userIsSSO: auth.getIn(['user', 'isSSO']),
    role: auth.get('role'),
    users: entities.getIn(['users', 'models']),
    permissions: entities.getIn(['permissions', 'models']),
    practiceName: entities.getIn(['accounts', 'models', auth.get('accountId'), 'name']),
    invites: entities.getIn(['invites', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      deleteEntityRequest,
      createEntityRequest,
      reset,
      updateEntityRequest,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(Users);
