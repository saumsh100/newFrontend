
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { setTime } from '../../../library/util/TimeOptions';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

export default function ShowAppointment(props) {
  const {
    appointment,
    bgColor,
    practIndex,
    selectAppointment,
    startHour,
    endHour,
    columnWidth,
  } = props;

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

  // Setting up an appointment object that can set the initial values of the edit form.
  const addToApp = Object.assign({}, appointment, {
    time: setTime(startDate),
    date: moment(startDate).format('L'),
    duration: [durationTime, bufferTime],
  });

  const addToPatient = Object.assign({}, patient, {
    patientSelected: patient,
    note,
  });

  // Calculating the top position and height of the appointment.
  const startDateHours = moment(startDate).hours();
  const startDateMinutes = moment(startDate).minutes();
  const topCalc = ((startDateHours - startHour) + (startDateMinutes / 60));

  const heightCalc = (durationTime) / 60;
  const totalHours = (endHour - startHour) + 1;

  const top = `${(topCalc / totalHours) * 100}%`;
  const left = `${(columnWidth * practIndex)}%`;
  const width = `${columnWidth}%`;
  const height = `${(heightCalc / totalHours) * 100}%`;

  const appStyle = {
    top,
    left,
    height,
    width,
    backgroundColor: bgColor,
  };

  // calculating the buffer position and height
  const heightCalcBuffer = `${((customBufferTime / 60) / totalHours) * 100}%`;
  const bufferStyle = {
    top: `${((topCalc / totalHours) * 100) + ((heightCalc / totalHours) * 100)}%`,
    left,
    width,
    height: heightCalcBuffer,
    backgroundColor: 'grey',
  };

  return (
    <div
      onClick={() => {
        selectAppointment({
          appointment: addToApp,
          patient: addToPatient,
         });
      }}
    >
      <div
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
      <div className={styles.showAppointment} style={bufferStyle}>
        {''}
      </div>
    </div>
  );
}
