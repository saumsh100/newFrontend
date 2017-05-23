
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
      bgColor,
    } = this.props;

    const duration =  moment(appointment.endDate).minutes();
    console.log(bgColor)
    const appStyle = {
      position: 'absolute',
      top: '0px',
      width: '100%',
      backgroundColor: bgColor,
      height: `${duration * 2}px`,
      boxShadow: '0px 5px 2px 1px rgba(180,180,181,1)',
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
