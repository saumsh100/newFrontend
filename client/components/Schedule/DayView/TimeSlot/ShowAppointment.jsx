
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { setTime } from '../../../library/util/TimeOptions';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

class ShowAppointment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      appointment,
      bgColor,
      selectAppointment,
      scale,
    } = this.props;

    const {
      note,
      startDate,
      endDate,
      customBufferTime,
      serviceData,
      chairData,
      patientData,
    } = appointment;

    const patient = patientData.toJS();
    const age = moment().diff(patient.birthDate, 'years');

    const durationTime = getDuration(startDate, endDate, customBufferTime);
    const bufferTime = customBufferTime ? durationTime + customBufferTime : durationTime;
    const addToApp = Object.assign({}, appointment, {
      time: setTime(startDate),
      date: moment(startDate).format('L'),
      duration: [durationTime, bufferTime],
    });

    const addToPatient = Object.assign({}, patient, {
      patientSelected: patient,
      note,
    });

    const appStyle = {
      top: `${moment(startDate).minutes() * scale}px`,
      backgroundColor: bgColor,
      height: `${(durationTime + customBufferTime) * scale}px`,
    };

    return (
      <div
        onClick={() => {
          selectAppointment({
            appointment: addToApp,
            patient: addToPatient,
          });
        }}
        className={styles.showAppointment}
        style={appStyle}
      >
        <div className={styles.showAppointment_nameAge}>
          <div className={styles.showAppointment_nameAge_name} >
            <span className={styles.paddingText}>{patient.firstName}</span>
            <span className={styles.paddingText}>{patient.lastName},</span>
            <span>{age}</span>
          </div>
        </div>
        <div className={styles.showAppointment_duration}>
          {moment(startDate).format('h:mm')}-{moment(endDate).format('h:mm a')}
        </div>
        <div className={styles.showAppointment_serviceChair}>
          <span className={styles.paddingText}>{serviceData},</span>
          <span>{chairData}</span>
        </div>
      </div>
    );
  }
}

export default ShowAppointment;
