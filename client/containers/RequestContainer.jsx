import React, { PropTypes } from 'react';
import Requests from '../components/Requests';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../thunks/fetchEntities';

class RequestContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'requests', join: ['service', 'patient'] });
  }

  render() {
    return (
      <div className={this.props.className}>
        <Requests
          requests={this.props.requests}
          patients={this.props.patients}
          services={this.props.services}
          borderColor={this.props.borderColor}
        />
      </div>
    );
  }
}

RequestContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);

  const patientIds = requests.toArray().map(request => request.get('patientId'));
  const patients = entities.getIn(['patients', 'models']).filter((patient) => {
    return patientIds.indexOf(patient.get('id')) > -1;
  });

  return {
    requests,
    patients,
    services,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

