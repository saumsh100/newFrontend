
import React, { PropTypes, Component } from 'react';
import PatientShow from '../components/Patients/PatientShow';
import axios from 'axios';

class PatientShowContainer extends Component {
  constructor(props) {
    super(props);
    
    this.state = { patient: null };
  }
  
  componentDidMount() {
    window.socket.on('receivePatient', (result) => {
      this.setState({ patient: result });
    });

    window.socket.emit('fetchPatient', { id: this.props.params.patientId });
  }
  
  render() {
    const { patient } = this.state;
    return (
      <PatientShow patient={patient} />
    );
  }
}

PatientShowContainer.propTypes = {};

export default PatientShowContainer;
