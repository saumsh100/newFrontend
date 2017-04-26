import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { List, Grid, CardHeader, Row } from '../../../library';
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
    const { users } = this.props;
    return (
      <Grid>
        <Row>
          <CardHeader title="Active Users" />
        </Row>
        <List className={styles.userList}>
        {users.toArray().map((user) => {
          return (
            <ActiveUsersList
              key={user.id}
              activeUser={user}
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
