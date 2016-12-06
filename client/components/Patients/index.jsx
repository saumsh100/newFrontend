
import React, { Component, PropTypes } from 'react';
import PatientList from './PatientList';
import styles from './styles.scss';

class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = { patients: [] };
    
    this.sendMessage = this.sendMessage.bind(this);
  }
  
  componentDidMount() {
    window.socket.on('receivePatients', (results) => {
      console.log('patients', results);
      this.setState({ patients: results });
    });
    
    window.socket.emit('fetchPatients');
  }
  
  sendMessage(patient) {
    window.socket.emit('sendMessage', { patient });
  }
  
  render() {
    const { patients } = this.state;
    return (
      <PatientList
        patients={patients}
        onChat={this.sendMessage}
      />
    );
  }
}

export default Patients;
