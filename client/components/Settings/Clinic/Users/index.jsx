import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities, deleteEntityRequest, createEntityRequest } from '../../../../thunks/fetchEntities';
import { List, Grid, Header, Row, Button } from '../../../library';
import ActiveUsersList from './ActiveUsersList';
import InviteUsersList from './InviteUsersList';
import InviteUser from './InviteUser';
import styles from './styles.scss';

class Users extends Component{
  constructor(props) {
    super(props);
    this.deleteInvite = this.deleteInvite.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.showInvite = this.showInvite.bind(this);
    this.state = { show: false };
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
      show: false,
    });

    this.props.createEntityRequest({ key: 'invites', entityData, url });
  }

  showInvite() {
    this.setState({
      show: !this.state.show,
    });
  }


  render() {
    const { users, permissions, accounts, invites } = this.props;
    const clinic = accounts.toArray()[0];
    let clinicName = '';
    if (clinic) {
      clinicName = clinic.getClinic();
    }
    const displayInvitation = (this.state.show ? <InviteUser sendInvite={this.sendInvite} /> : null);
    return (
      <Grid>
        {displayInvitation}
        <Row className={styles.mainHead}>
          <Header title={`Users in ${clinicName}`} />
          <Button className={styles.inviteUser} onClick={this.showInvite} >Invite a User</Button>
        </Row>
        <List className={styles.userList}>
        {users.toArray().map((user, i) => {
          permissions.toArray()[i].getRole();
          return (
            <ActiveUsersList
              key={user.id}
              activeUser={user}
              role={permissions.toArray()[i].getRole()}
            />
          );
        })}
        </List>
        <Row>
          <Header className={styles.header} title={`Users invited to ${clinicName}`} />
        </Row>
        <List className={styles.userList}>
          {invites.toArray().map((invite) => {
            return (
              <InviteUsersList
                key={invite.id}
                email={invite.getEmail()}
                date={invite.getDate()}
                onDelete={this.deleteInvite.bind(null, invite.getId())}
              />
            );
          })}
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
