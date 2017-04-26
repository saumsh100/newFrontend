import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import jwt from 'jwt-decode';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { List, Grid, CardHeader, Row } from '../../../library';
import CareCruUser from './ActiveUserList';


class CareCruUsers extends Component{
  constructor(props) {
    super(props)
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
          <CardHeader title="CareCru Users" />
        </Row>
        <List>
        {users.toArray().map((user) => {
          return (
              <CareCruUser
                key={user.id}
                careCruUser={user}
              />
          );
        })}
        </List>
      </Grid>
    );
  }
}

CareCruUsers.propTypes = {
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

export default enhance(CareCruUsers);
