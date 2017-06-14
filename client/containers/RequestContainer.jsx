
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
    this.props.fetchEntities({ key: 'requests', join: ['service', 'patient', 'patientUser'] });
  }

  render() {
    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    return (
      <Requests
        requests={this.props.requests}
        patients={this.props.patients}
        services={this.props.services}
        patientUsers={this.props.patientUsers}
        location={location}
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

  const patientIds = requests.toArray().map(request => request.get('patientId'));
  const patients = entities.getIn(['patients', 'models']).filter((patient) => {
    return patientIds.indexOf(patient.get('id')) > -1;
  });

  console.log(patientUsers);
  return {
    requests,
    patients,
    services,
    patientUsers,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

