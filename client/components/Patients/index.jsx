
import React, { Component, PropTypes } from 'react';
import PatientList from './PatientList';
import styles from './styles.scss';
import './style.css'

class Patients extends Component {
  constructor(props) {
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(patient) {
    window.socket.emit('sendMessage', { patient });
  }

  render() {
    const { patients } = this.props;
    // if (patients.get('lastUpdated') === null) return null;

    return (
      <PatientList
        patients={patients}
        onChat={this.sendMessage}
      />
    );
  }
}

Patients.propTypes = {
  patients: PropTypes.object.isRequired,
};



export default Patients;
