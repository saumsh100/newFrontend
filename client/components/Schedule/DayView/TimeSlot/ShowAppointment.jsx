
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
      practIndex,
      selectAppointment,
      startHour,
      endHour,
      columnWidth,
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

    const slotHeight = 100 / (endHour - startHour);
    const left = `${(columnWidth * practIndex)}%`;
    const appointmentHeight = ((durationTime + customBufferTime) / 60) * slotHeight
    console.log(slotHeight)
    console.log(slotHeight * (moment(startDate).hours() - startHour));

    const appStyle = {
      top: `${slotHeight * (moment(startDate).hours() - startHour)}%`,
      left,
      width: `${columnWidth}%`,
      height: `${appointmentHeight}%`,
      backgroundColor: bgColor,
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
