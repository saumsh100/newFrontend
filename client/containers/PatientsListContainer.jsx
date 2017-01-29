
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/PatientList/';
import { fetchEntities } from '../thunks/fetchEntities';
import { setCurrentPatient } from '../thunks/patientList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: fetchEntities for patients, add query for fetching patients by next appointment
    const options = { key: 'patients', params: { patientsList: true } };
    this.props.fetchEntities(options);
  }

  render() {
    const {
      patients,
      setCurrentPatient,
    } = this.props;
    //const { patient, patients } = this.state;
    return (
      <PatientList 
        setCurrentPatient={setCurrentPatient}
        patients={patients}
      />
    );
  }
}

PatientsListContainer.propTypes = {};

function mapStateToProps({ entities, currentPatient }) {
    return {
      patients: entities.get('patientList'),
      currentPatient,
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
