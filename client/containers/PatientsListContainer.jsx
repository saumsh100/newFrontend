
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities } from '../thunks/fetchEntities';
import { 
  setCurrentPatient,
} from '../thunks/patientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const options = { key: 'patients', params: { patientsList: true } };
    this.props.fetchEntities(options);
  }

  componentWillReceiveProps(nextProps) {
    const { filters } = this.props;
    const patientName = filters
    && filters.values && filters.values.patients;
    if (!patientName) return
    if (patientName && !nextProps.filters.values) return;
    if (patientName != nextProps.filters.values.patients) {
      this.props.fetchEntities({ key: 'patients', params: { patientsList: true, patientName }})
    }
  }

  render() {
    const {
      patients,
      setCurrentPatient,
      filters,
    } = this.props;
    {console.log('currentPatient', this.props.currentPatient.get('currentPatient'))}
    return (
      <PatientList
        setCurrentPatient={setCurrentPatient}
        currentPatient={this.props.currentPatient.get('currentPatient')}
        patients={patients}
        filters={filters}
      />
    );
  }
}

PatientsListContainer.propTypes = {};

function mapStateToProps({ entities, patientList, form }) {
    return {
      patients: entities.get('patientList'),
      currentPatient: patientList,
      filters: form.patientList,
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setCurrentPatient,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsListContainer);
