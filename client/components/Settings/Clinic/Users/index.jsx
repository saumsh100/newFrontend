import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities, deleteEntityRequest, createEntityRequest, updateEntityRequest } from '../../../../thunks/fetchEntities';
import { List, ListItem, Grid, Header, Modal, Row, Button, DropdownSelect } from '../../../library';
import ActiveUsersList from './ActiveUsersList';
import InviteUsersList from './InviteUsersList';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import InviteUserForm from './InviteUserForm';
import styles from './styles.scss';

class Users extends Component{
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      editActive: false,
      editValue: 'VIEWER',
      roleChange: {},
    };

    this.deleteInvite = this.deleteInvite.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.addUser = this.addUser.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.editUser = this.editUser.bind(this);
    this.editDropdown = this.editDropdown.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/accounts/${decodedToken.activeAccountId}/users`;
    const urlInvites = `/api/accounts/${decodedToken.activeAccountId}/invites`;
    this.props.fetchEntities({ url });
    this.props.fetchEntities({ url: urlInvites });

    this.setState({
      userId: decodedToken.userId,
      role: decodedToken.role,
    });
  }

  deleteInvite(id) {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/accounts/${decodedToken.activeAccountId}/invites/${id}`;
    this.props.deleteEntityRequest({ key: 'invites', id, url });
  }

  sendInvite(entityData) {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/accounts/${decodedToken.activeAccountId}/invites/`;
    entityData.accountId = decodedToken.activeAccountId;
    entityData.sendingUserId = decodedToken.userId;

    this.setState({
      active: false,
    });

    this.props.createEntityRequest({ key: 'invites', entityData, url });
    entityData.email = '';
  }

  sendEdit() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    this.setState({
      editActive: false,
    });

    const values = {
      role: this.state.editValue,
    };

    const url = `/api/accounts/${decodedToken.activeAccountId}/permissions/${this.state.editPermissionId}`

    this.props.updateEntityRequest({ key: 'accounts', values, url });
  }

  reinitializeState() {

    const newState = {
      active: false,
      editActive: false,
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
    } = this.state;
    const clinic = accounts.toArray()[0];
    let clinicName = '';
    if (clinic) {
      clinicName = clinic.get('name');
    }

    let usersInvited = <ListItem className={styles.userListItem}>
      <div className={styles.main}>
        <p className={styles.name}>Users you have invited will show up here.</p>
      </div>
    </ListItem>
    if (invites.size !== 0){
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

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Save', onClick: this.sendInvite, component: RemoteSubmitButton, props: { form: formName }},
    ];

    const editActions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button },
      { label: 'Edit', onClick: this.sendEdit, component: Button },
    ];

    return (
      <Grid>
        <Header title={'Users'} />
        <Modal
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
        </Modal>
        <Modal
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
            options={[
            { value: 'OWNER' },
            { value: 'ADMIN' },
            { value: 'VIEWER' },
          ]}
          />
        </Modal>
        <Row className={styles.mainHead}>
          <h2 className={styles.mainHeader}>Users in {clinicName}</h2>
          <Button className={styles.inviteUser} onClick={this.addUser} >Invite a User</Button>
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
  users: PropTypes.object,
  permissions: PropTypes.object,
  accounts: PropTypes.object,
  invites: PropTypes.object,
};

function mapStateToProps({ entities }) {
  return {
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
