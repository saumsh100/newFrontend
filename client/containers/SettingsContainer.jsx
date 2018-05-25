
import React, { PropTypes, Component } from 'react';
import jwt from 'jwt-decode';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { fetchEntities } from '../thunks/fetchEntities';

// TODO: fetch current Settings and user (should already be in Redux)
class SettingsContainer extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const url = `/api/users/${decodedToken.userId}`;

    Promise.all([
      this.props.fetchEntities({ url }),
      this.props.fetchEntities({ key: 'accounts', join: ['weeklySchedule'] }),
    ]);
  }

  render() {
    return <Settings {...this.props} />;
  }
}

SettingsContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities, auth }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    users: entities.getIn(['users', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
    },
    dispatch
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(SettingsContainer);
