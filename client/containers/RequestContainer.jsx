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
    this.props.fetchEntities({ key: 'requests' });
  }

  render() {
    return (
      <div>
        <Requests
          requests={this.props.requests}
          patients={this.props.patients}
        />
      </div>
    );
  }
}

RequestContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  const requests = entities.getIn(['requests', 'models']);
  const patientIds = requests.toArray().map(request => request.get('patientId'));
  const patients = entities.getIn(['patients', 'models']).filter((patient) => {
    return patientIds.indexOf(patient.get('id')) > -1;
  });

  return {
    requests,
    patients,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

