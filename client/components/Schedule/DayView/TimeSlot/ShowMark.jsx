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
    practIndex,
    startHour,
    endHour,
    columnWidth,
    rowSort,
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
  const topCalc = ((startDateHours - startHour) + (startDateMinutes / 60));

  const heightCalc = (durationTime) / 60;
  const totalHours = (endHour - startHour) + 1;

  // const adjacentWidth = rowSort.length === 1 ? widthIntersect : rowSort.length

  const splitRow = rowSort.length > 1 ? (columnWidth * (appPosition / (rowSort.length))) : 0;
  const top = `${(topCalc / totalHours) * 100}%`;
  const left = `${(columnWidth * practIndex) + splitRow}%`;
  const width = `${columnWidth * ((100 / rowSort.length) / 100)}%`;
  const height = `${(heightCalc / totalHours) * 100}%`;

  // main app style
  const appStyle = {
    top,
    left,
    height,
    width,
    backgroundColor: hexToRgbA('#b4b4b5', 0.6),
    border: '1.5px solid #b4b4b5',
    zIndex: appPosition,
  };

  return (
    <div
      key={appointment.id}
      className={styles.appointmentContainer}
    >
      <div
        key={appointment.id}
        className={styles.showAppointment}
        style={appStyle}
      >
        <div className={styles.showAppointment_mark}>
          <span className={styles.showAppointment_mark_note}> {note || ''} </span>
        </div>
      </div>
    </div>
  );
}
