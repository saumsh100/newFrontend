
import React, { PropTypes, Component } from 'react';
import Requests from '../components/Requests';
import { createBrowserHistory } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';

class RequestContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntitiesRequest({
      id: 'scheduleRequests',
      key: 'requests',
      join: ['service', 'patientUser', 'practitioner'],
    });
  }

  render() {
    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    return (
      <Requests
        requests={this.props.requests}
        services={this.props.services}
        patientUsers={this.props.patientUsers}
        practitioners={this.props.practitioners}
        location={location}
        isLoaded={this.props.scheduleRequestsFetched}
        runAnimation
      />
    );
  }
}

RequestContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func,
  scheduleRequestsFetched: PropTypes.bool,
  requests: PropTypes.object,
  services: PropTypes.object,
  patientUsers: PropTypes.object,
};

function mapStateToProps({ entities, apiRequests }) {

  const scheduleRequestsFetched = (apiRequests.get('scheduleRequests') ? apiRequests.get('scheduleRequests').wasFetched : null);

  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  return {
    requests,
    services,
    patientUsers,
    practitioners,
    scheduleRequestsFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

