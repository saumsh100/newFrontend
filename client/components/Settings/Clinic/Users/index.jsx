import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities, deleteEntityRequest, createEntityRequest } from '../../../../thunks/fetchEntities';
import { List, ListItem, Grid, Header, Modal, Row, Button } from '../../../library';
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
    };

    this.deleteInvite = this.deleteInvite.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.addUser = this.addUser.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/accounts/${decodedToken.activeAccountId}/users`;
    const urlInvites = `/api/accounts/${decodedToken.activeAccountId}/invites`;
    this.props.fetchEntities({ url });
    this.props.fetchEntities({ url: urlInvites });
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

  reinitializeState() {
    this.setState({
      active: false,
    });
  }

  addUser() {
    this.setState({
      active: true,
    });
  }

  render() {
    const formName = 'emailInvite';
    const { users, permissions, accounts, invites } = this.props;
    const {
      active,
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
    return (
      <Grid>
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
        <Row className={styles.mainHead}>
          <Header title={`Users in ${clinicName}`} />
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
            />
          );
        })}
        </List>
        <Row>
          <Header className={styles.header} title={`Users invited to ${clinicName}`} />
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
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Users);
