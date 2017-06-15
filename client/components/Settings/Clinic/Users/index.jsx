import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities, deleteEntityRequest, createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { List, ListItem, Grid, Header, DialogBox, Row, Button, DropdownSelect } from '../../../library';
import ActiveUsersList from './ActiveUsersList';
import InviteUsersList from './InviteUsersList';
import NewUserForm from './NewUserForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import InviteUserForm from './InviteUserForm';
import styles from './styles.scss';

class Users extends Component{
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

    const url = `/api/accounts/${accountId}/invites/${id}`;
    this.props.deleteEntityRequest({ key: 'invites', id, url });
  }

  sendNewUser(entityData) {
    const { accountId, userId } = this.props;

    const url = `/api/accounts/${accountId}/newUser/`;
    entityData.accountId = accountId;
    entityData.sendingUserId = userId;

    this.setState({
      newActive: false,
    });

    this.props.createEntityRequest({ key: 'user', entityData, url });

    // reseting inputs to empty
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

    this.props.createEntityRequest({ key: 'invites', entityData, url });
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

    const url = `/api/accounts/${accountId}/permissions/${this.state.editPermissionId}`

    this.props.updateEntityRequest({ key: 'accounts', values, url });
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
    const {
      active,
      editActive,
      newActive,
    } = this.state;
    let clinic;

    accounts.toArray().map((account) => {
      clinic = (account.id === this.props.accountId ? account : null);
      return null;
    });

    let clinicName = '';
    if (clinic) {
      clinicName = clinic.get('name');
    }

    let usersInvited = (<div className={styles.userListItem}>
      <div className={styles.main}>
        <p className={styles.name}>Users you have invited will show up here.</p>
      </div>
    </div>);

    if (invites.size !== 0) {
      usersInvited = invites.toArray().map((invite) => {
        return (
          <InviteUsersList
            key={invite.id}
            email={invite.get('email')}
            currentUserRole={this.state.role}
            date={invite.get('createdAt')}
            onDelete={this.deleteInvite.bind(null, invite.get('id'))}
            mainStyle={styles.main}
            nameStyle={styles.name}
            emailStyle={styles.email}
            userListStyle={styles.userListItem}
            editStyles={styles.edit}
          />
        );
      })
    }
    let options;
    if (this.state.role === 'SUPERADMIN') {
      options = [
        { value: 'OWNER' },
        { value: 'MANAGER' },
      ];
    }

    switch (this.state.role) {
      case 'SUPERADMIN':
        options = [
          { value: 'ADMIN' },
          { value: 'OWNER' },
          { value: 'MANAGER' },
        ];
        break;
      case 'ADMIN':
        options = [
          { value: 'OWNER' },
          { value: 'MANAGER' },
        ];
        break;
      case 'OWNER':
        options = [
          { value: 'OWNER' },
          { value: 'MANAGER' },
        ];
        break;
      default:
        options = [];
        break;
    }

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.sendInvite, component: RemoteSubmitButton, props: { form: formName }},
    ];

    const actionsNewUser = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.sendNewUser, component: RemoteSubmitButton, props: { form: 'newUser' }},
    ];

    const editActions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Edit', onClick: this.sendEdit, component: Button },
    ];

    const addUserButton = (this.props.role === 'SUPERADMIN' ? (
      <Button className={styles.inviteUser} onClick={this.addNewUser} >Add a User</Button>) : null);

    return (
      <Grid>
        <Header title={'Users'} className={styles.userHeaderTitle} />
        <DialogBox
          actions={actions}
          title="Email Invite"
          type="small"
          active={active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
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
          <h2 className={styles.mainHeader}>Users in {clinicName}</h2>
          <div>
            {addUserButton}
            <Button className={styles.inviteUser} onClick={this.addUser} >Invite a User</Button>
          </div>
        </Row>
        <List className={styles.userList}>
        {users.toArray().map((user, i) => {
          permissions.toArray()[i].get('role');
          return (
            <ActiveUsersList
              key={user.id}
              activeUser={user}
              role={permissions.toArray()[i].get('role')}
              currentUserId={this.state.userId}
              userId={user.get('id')}
              currentUserRole={this.state.role}
              edit={this.editUser.bind(null, user.get('id'), permissions.toArray()[i].get('id'), permissions.toArray()[i].get('role'), i)}
            />
          );
        })}
        </List>
        <Row>
          <h2 className={styles.header} >Pending Invitations</h2>
        </Row>
        <List className={styles.userList}>
          {usersInvited}
        </List>
      </Grid>
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
  return bindActionCreators({
    fetchEntities,
    deleteEntityRequest,
    createEntityRequest,
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Users);
