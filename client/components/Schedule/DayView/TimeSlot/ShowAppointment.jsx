
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

    const startDateHours = moment(startDate).hours();
    const startDateMinutes = moment(startDate).minutes();
    const topCalc = ((startDateHours - startHour) + startDateMinutes)

    const endDateHours = moment(endDate).hours();
    const endDateMinutes = moment(endDate).minutes();
    const heightCalc = (endDateHours - startDateHours);

    const totalHours = (endHour - startHour);

    const top = `${(topCalc / (totalHours + 1)) * 100}%`;
    const left = `${(columnWidth * practIndex)}%`;
    const width = `${columnWidth}%`;
    const height = `${((moment(endDate).hours() - moment(startDate).hours()) / (totalHours + 1)) * 100}%`;
    console.log(height);

    const appStyle = {
      top,
      left,
      height,
      width,
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
