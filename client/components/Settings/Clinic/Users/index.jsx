import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { List, Grid, Header, Row } from '../../../library';
import ActiveUsersList from './ActiveUsersList';
import styles from './styles.scss';

class Users extends Component{
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/accounts/${decodedToken.activeAccountId}/users`;
    this.props.fetchEntities({ url });
  }

  render() {
    const { users, permissions, accounts } = this.props;
    const clinic = accounts.toArray()[0];
    console.log(clinic);
    let clinicName = '';
    if (clinic) {
      clinicName = clinic.getClinic();
    }
    return (
      <Grid>
        <Row>
          <Header title={`Users in ${clinicName}`} />
        </Row>
        <List className={styles.userList}>
        {users.toArray().map((user, i) => {
          permissions.toArray()[i].getRole()
          return (
            <ActiveUsersList
              key={user.id}
              activeUser={user}
              role={permissions.toArray()[i].getRole()}
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
  users: PropTypes.object,
  permissions: PropTypes.object,
  accounts: PropTypes.object,
};

function mapStateToProps({ entities }) {
  return {
    users: entities.getIn(['users', 'models']),
    permissions: entities.getIn(['permissions', 'models']),
    accounts: entities.getIn(['accounts', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Users);
