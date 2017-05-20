
import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';

export default function renderAppoinment(props) {
  const { appointment, scale, startDay, index, selectAppointment } = props;

  const start = appointment.startTime;
  const end = appointment.endTime;
  const minutesDuration = end.diff(start, 'minutes');
  const positionTop = start.diff(startDay, 'minutes') * scale ;
  const appointmentStyles = {
    height: `${minutesDuration * scale}px`,
    top: `${positionTop}px`,
    cursor: 'pointer',
  };
  const format = 'MMMM Do YYYY, h:mm:ss a';
  const displayStartDate = appointment.startTime.format(format);
  const displayEndDate = appointment.endTime.format(format);
  return (
    <div
      key={index}
      className={styles.appointment}
      style={appointmentStyles}
      onClick={() => {
        selectAppointment({
          appointment: appointment.app,
          patient: appointment.patient,
        });
      }}
    >
      <div className={styles.appointment__username}>{appointment.name}</div>
      <div className={styles.appointment__date}>{`${displayStartDate} - ${displayEndDate}`}</div>
      <div className={styles.appointment__title}>{appointment.title}</div>
    </div>
  );
}
