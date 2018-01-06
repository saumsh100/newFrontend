import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

function hexToRgbA(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c &255].join(',')}, ${opacity})`;
  }
  throw new Error('Bad Hex');
}

export default function ShowMark(props) {
  const {
    appointment,
    startHour,
    rowSort,
    timeSlotHeight,
  } = props;

  const {
    startDate,
    endDate,
    customBufferTime,
    note,
  } = appointment;


  let appPosition = 0;
  rowSort.map((app, index) => {
    if (appointment.id === app.id) {
      appPosition = index;
    }
  });

  // Calculating the top position and height of the appointment.
  const durationTime = getDuration(startDate, endDate, customBufferTime);
  const startDateHours = moment(startDate).hours();
  const startDateMinutes = moment(startDate).minutes();
  const topCalc = (((startDateHours - startHour) + (startDateMinutes / 60)) * timeSlotHeight.height) //+ timeSlotHeight.height;

  const heightCalc = ((durationTime) / 60) * timeSlotHeight.height;


  const splitRow = rowSort.length > 1 ? (100 * (appPosition / (rowSort.length))) : 0;
  const top = `${(topCalc + 0.05)}px`;
  const left = `${(0 + splitRow) + 0.07}%`;
  const width = `${(100 * ((100 / rowSort.length) / 100)) - 0.16}%`;
  const height = `${heightCalc - 0.1}px`;

  // main app style
  const appStyle = {
    top,
    left,
    height,
    backgroundColor: hexToRgbA('#b4b4b5', 1),
    border: `0.5px solid ${appPosition === 0 ? hexToRgbA('#b4b4b5', 1) : '#FFFFFF'}`,
    zIndex: appPosition,
  };

  return (
    <div
      key={appointment.id}
      className={styles.appointmentContainer}
      style={{ position: 'absolute', height: `${(heightCalc - 0.1)}px`, top, width, left }}
    >
      <div
        key={appointment.id}
        className={styles.showAppointment}
        style={appStyle}
      >
        <div className={styles.showAppointment_mark} >
          <span className={styles.showAppointment_mark_note} style={{ width, maxHeight: height, }}> {note || ''} </span>
        </div>
      </div>
    </div>
  );
}

ShowMark.propTypes = {
  appointment: PropTypes.object.isRequired,
  startHour: PropTypes.number,
  rowSort: PropTypes.array(Array),
  timeSlotHeight: PropTypes.object,
};
