
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import {
  fetchEntities,
  deleteEntityRequest,
  createEntityRequest,
  updateEntityRequest,
} from '../../../../thunks/fetchEntities';
import {
  List,
  ListItem,
  Grid,
  Header,
  DialogBox,
  Row,
  Button,
  DropdownSelect,
} from '../../../library';
import ActiveUsersList from './ActiveUsersList';
import InviteUsersList from './InviteUsersList';
import NewUserForm from './NewUserForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import InviteUserForm from './InviteUserForm';
import SettingsCard from '../../Shared/SettingsCard';
import styles from './styles.scss';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      editActive: false,
      newActive: false,
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

  componentWillMount() {
    const { accountId, role, userId } = this.props;

    const url = `/api/accounts/${accountId}/users`;
    const urlInvites = `/api/accounts/${accountId}/invites`;

    this.props.fetchEntities({ url });
    this.props.fetchEntities({ url: urlInvites });

    this.setState({
      yep: userId,
      role,
    });
  }

  deleteInvite(id) {
    const { accountId } = this.props;

    const alert = {
      success: {
        body: 'Invite Deleted.',
      },
      error: {
        body: 'Invite Could Not Be Deleted',
      },
    };

    const url = `/api/accounts/${accountId}/invites/${id}`;
    this.props.deleteEntityRequest({ key: 'invites', id, url, alert });
  }

  sendNewUser(entityData) {
    const { accountId, userId } = this.props;

    const url = `/api/accounts/${accountId}/newUser/`;
    entityData.accountId = accountId;
    entityData.sendingUserId = userId;

    this.setState({
      newActive: false,
    });

    const alert = {
      success: {
        body: 'User Created.',
      },
      error: {
        body: 'User Could Not Be Created',
      },
    };

    this.props.createEntityRequest({ key: 'user', entityData, url, alert });

    // resetting inputs to empty
    entityData.firstName = '';
    entityData.lastName = '';
    entityData.username = '';
    entityData.password = '';
    entityData.confirmPassword = '';
  }

  sendInvite(entityData) {
    const { accountId, userId } = this.props;

    const url = `/api/accounts/${accountId}/invites/`;
    entityData.accountId = accountId;
    entityData.sendingUserId = userId;

    this.setState({
      active: false,
    });

    const alert = {
      success: {
        body: 'Invite Sent.',
      },
      error: {
        body: 'Invite Could Not Be Sent',
      },
    };

    this.props.createEntityRequest({ key: 'invites', entityData, url, alert });
    entityData.email = '';
  }

  sendEdit() {
    const { accountId } = this.props;

    this.setState({
      editActive: false,
    });

    const values = {
      role: this.state.editValue,
    };

    const url = `/api/accounts/${accountId}/permissions/${this.state.editPermissionId}`;
    let userOwner = false;
    let numOfOwners = 0;
    this.props.users.toArray().map((user, i) => {
      const permission = this.props.permissions.get(user.permissionId);
      if (!permission) {
        return null;
      }
      if (
        this.state.editPermissionId === permission.toJS().id &&
        permission.toJS().role === 'OWNER'
      ) {
        userOwner = true;
      }
      if (permission.toJS().role === 'OWNER') {
        numOfOwners++;
      }
      return null;
    });

    if (numOfOwners === 1 && userOwner === true) {
      alert('There must be one Owner!');
    } else {
      const alert = {
        success: {
          body: 'Permission Changed.',
        },
        error: {
          body: 'Permission Could Not Be Changed',
        },
      };

      this.props.updateEntityRequest({ key: 'accounts', values, url, alert });
    }
  }

  reinitializeState() {
    const newState = {
      active: false,
      editActive: false,
      newActive: false,
      roleChange: this.state.roleChange,
    };

    newState.roleChange[this.state.userEdit] = this.state.editValue;

    this.setState(newState);
  }

  addUser() {
    this.setState({
      active: true,
    });
  }

  addNewUser() {
    this.setState({
      newActive: true,
    });
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
    const { users, permissions, accounts, invites } = this.props;
    const { active, editActive, newActive } = this.state;

    let clinicName = null;

    for (let i = 0; i < accounts.toArray().length; i++) {
      if (accounts.toArray()[i].id === this.props.accountId) {
        clinicName = accounts.toArray()[i].name;
        break;
      }
    }

    let usersInvited = (
      <div className={styles.userListItem}>
        <div className={styles.main}>
          <p className={styles.name}>Users you have invited will show up here.</p>
        </div>
      </div>
    );

    if (invites.size !== 0) {
      usersInvited = invites.toArray().map(invite => (
        <InviteUsersList
          key={invite.id}
          id={invite.id}
          email={invite.get('email')}
          currentUserRole={this.state.role}
          date={invite.get('createdAt')}
          onDelete={this.deleteInvite.bind(null, invite.get('id'))}
          mainStyle={styles.main}
          nameStyle={styles.name}
          emailStyle={styles.email}
          userListStyle={styles.userListItem}
          editStyles={styles.cancel}
        />
      ));
    }
    const options = [{ value: 'OWNER' }, { value: 'ADMIN' }, { value: 'MANAGER' }];

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
        props: { color: 'blue', form: formName },
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
        props: { color: 'blue', form: 'newUser' },
      },
    ];

    const editActions = [
      {
        label: 'Cancel',
        onClick: this.reinitializeState,
        component: Button,
        props: { border: 'blue' },
      },
      { label: 'Edit', onClick: this.sendEdit, component: Button, props: { color: 'blue' } },
    ];

    const addUserButton =
      this.props.role === 'SUPERADMIN' ? (
        <Button
          className={styles.inviteUser}
          onClick={this.addNewUser}
          data-test-id="addUserButton"
          secondary
        >
          Add a User
        </Button>
      ) : null;

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
            formName={'newUser'}
          />
        </DialogBox>
        <DialogBox
          actions={editActions}
          title="Edit User Rights"
          type="small"
          active={editActive}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <DropdownSelect
            value={this.state.editValue}
            onChange={this.editDropdown}
            className={styles.dropdown}
            options={options}
          />
        </DialogBox>
        <Row className={styles.mainHead}>
          <Header className={styles.header} contentHeader title={`Users in ${clinicName}`} />
          <div className={styles.paddingRight}>
            {addUserButton}
            <Button
              className={styles.inviteUser}
              onClick={this.addUser}
              data-test-id="inviteUserButton"
              secondary
            >
              Invite a User
            </Button>
          </div>
        </Row>
        <List className={styles.userList} data-test-id="activeUsersList">
          {users.toArray().map((user, i) => {
            const permission = permissions.get(user.permissionId);
            if (!permission) {
              return null;
            }

            return (
              <ActiveUsersList
                key={user.id}
                activeUser={user}
                role={permission.get('role')}
                currentUserId={this.state.userId}
                userId={user.get('id')}
                currentUserRole={this.state.role}
                edit={this.editUser.bind(
                  null,
                  user.get('id'),
                  permission.get('id'),
                  permission.get('role'),
                  i
                )}
              />
            );
          })}
        </List>
        <Row>
          <Header className={styles.header} contentHeader title="Pending Invitations" />
        </Row>
        <List className={styles.userList}>{usersInvited}</List>
      </SettingsCard>
    );
  }
}

Users.propTypes = {
  fetchEntities: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  accountId: PropTypes.string,
  userId: PropTypes.string,
  role: PropTypes.string,
  users: PropTypes.object,
  permissions: PropTypes.object,
  accounts: PropTypes.object,
  invites: PropTypes.object,
};

function mapStateToProps({ entities, auth }) {
  return {
    accountId: auth.get('accountId'),
    userId: auth.getIn(['user', 'id']),
    role: auth.get('role'),
    users: entities.getIn(['users', 'models']),
    permissions: entities.getIn(['permissions', 'models']),
    accounts: entities.getIn(['accounts', 'models']),
    invites: entities.getIn(['invites', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      deleteEntityRequest,
      createEntityRequest,
      updateEntityRequest,
    },
    dispatch
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Users);
