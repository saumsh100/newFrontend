
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

    const duration = moment(appointment.endDate).minutes();

    const appStyle = {
      top: '0px',
      backgroundColor: bgColor,
      height: `${duration * 2}px`,
    };

    const patient = appointment.patientData.toJS();
    const age = moment().diff(patient.birthDate, 'years');
    return (
      <div className={styles.showAppointment} style={appStyle}>
        <div className={styles.showAppointment_nameAge}>
          <div className={styles.showAppointment_nameAge_name} >
            <span className={styles.paddingText}>{patient.firstName}</span>
            <span className={styles.paddingText}>{patient.lastName},</span>
            <span>{age}</span>
          </div>
        </div>

        <div className={styles.showAppointment_duration}>
          {moment(appointment.startDate).format('h:mm')}-{moment(appointment.endDate).format('h:mm a')}
        </div>
        <div className={styles.showAppointment_serviceChair}>
          <span className={styles.paddingText}>{appointment.serviceData}</span>
          <span>{appointment.chairData}</span>
        </div>
      </div>
    );
  }
}

export default ShowAppointment;
