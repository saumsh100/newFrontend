
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';

class ShowAppointment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appointment,
    } = this.props;

    const appStyle = {
      position: 'absolute',
      top: '0px'
    };

    const patient = appointment.patientData.toJS();
    return (
      <div style={appStyle}>
        {moment(appointment.endDate).minutes()}
        {patient.firstName}
        {appointment.serviceData}
        {appointment.chairData}
      </div>
    );
  }
}

export default ShowAppointment;
