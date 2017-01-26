
import React, { PropTypes, Component } from 'react';
import PatientMessages from '../components/Patients/Messages';

class PatientsMessagesContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: fetchEntities for recent conversations
  }

  render() {
    // const { patient, patients } = this.state;
    return (
      <PatientMessages />
    );
  }
}

PatientsMessagesContainer.propTypes = {};

export default PatientsMessagesContainer;
