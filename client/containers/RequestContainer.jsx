
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { selectedRequestBuilder } from '../components/Utils';
import { isHub } from '../util/hub';
import { setTitle } from '../reducers/electron';
import { loadOnlineRequest } from '../thunks/onlineRequests';
import RequestsModel from '../entities/models/Request';
import Requests from '../components/Requests';

class RequestContainer extends Component {
  componentDidMount() {
    if (this.props.requests.size === 0) {
      this.props.loadOnlineRequest();
    }
  }

  componentDidUpdate() {
    const { filteredRequests, selectedRequest } = this.props;

    if (isHub() && !selectedRequest) {
      this.props.setTitle(`${filteredRequests.length} Online Requests`);
    }
  }

  render() {
    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    return (
      <Requests
        requests={this.props.requests}
        filteredRequests={this.props.filteredRequests}
        sortedRequests={this.props.sortedRequests}
        requestId={this.props.requestId}
        selectedRequest={this.props.selectedRequest}
        services={this.props.services}
        patientUsers={this.props.patientUsers}
        practitioners={this.props.practitioners}
        location={location}
        isLoaded={this.props.scheduleRequestsFetched}
        runAnimation
        redirect={this.props.redirect}
      />
    );
  }
}

RequestContainer.propTypes = {
  loadOnlineRequest: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  scheduleRequestsFetched: PropTypes.bool,
  redirect: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  requests: PropTypes.instanceOf(Map),
  filteredRequests: PropTypes.arrayOf(RequestsModel),
  sortedRequests: PropTypes.arrayOf(RequestsModel),
  requestId: PropTypes.string,
  selectedRequest: PropTypes.instanceOf(RequestsModel),
  services: PropTypes.instanceOf(Map),
  practitioners: PropTypes.instanceOf(Map),
  patientUsers: PropTypes.instanceOf(Map),
};

RequestContainer.defaultProps = {
  scheduleRequestsFetched: false,
  redirect: {
    pathname: '',
    search: '',
  },
  requests: Map({}),
  filteredRequests: [],
  sortedRequests: [],
  requestId: '',
  selectedRequest: null,
  services: Map({}),
  practitioners: Map({}),
  patientUsers: Map({}),
};

function mapStateToProps({ entities, apiRequests, router }, ownProps) {
  const scheduleRequestsFetched = apiRequests.get('scheduleRequests')
    ? apiRequests.get('scheduleRequests').wasFetched
    : null;

  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  const filteredRequests = requests
    .toArray()
    .filter(req => !req.get('isCancelled') && !req.get('isConfirmed'));

  const sortedRequests = filteredRequests.sort(
    (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate),
  );
  const nextProps = {
    router,
    sortedRequests,
    ...ownProps,
  };
  return {
    requests,
    filteredRequests,
    sortedRequests,
    services,
    patientUsers,
    practitioners,
    scheduleRequestsFetched,
    ...selectedRequestBuilder(nextProps),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadOnlineRequest,
      setTitle,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(RequestContainer);
