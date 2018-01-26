
import React, { PropTypes } from 'react';
import Requests from '../components/Requests';
import { createBrowserHistory } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../thunks/fetchEntities';

class RequestContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'requests', join: ['service', 'patientUser', 'practitioner'] });
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
        maxHeight={this.props.maxHeight}
      />
    );
  }
}

RequestContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  return {
    requests,
    services,
    patientUsers,
    practitioners,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

