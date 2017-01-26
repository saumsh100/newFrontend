
import React, { PropTypes, Component } from 'react';
import PatientList from '../components/Patients/Patients';

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: fetchEntities for patients, add query for fetching patients by next appointment
  }

  render() {
    //const { patient, patients } = this.state;
    return (
      <PatientList />
    );
  }
}

PatientsListContainer.propTypes = {};

export default PatientsListContainer;
