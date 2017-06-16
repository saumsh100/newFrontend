
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { Icon } from '../../../library';

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
    startDate,
    endDate,
    customBufferTime,
    serviceData,
    chairData,
    patientData,
    isPatientConfirmed,
    isSplit,
    adjacent,
  } = appointment;

  const patient = patientData.toJS();
  const age = moment().diff(patient.birthDate, 'years');

  // Calculating the top position and height of the appointment.
  const durationTime = getDuration(startDate, endDate, customBufferTime);
  const startDateHours = moment(startDate).hours();
  const startDateMinutes = moment(startDate).minutes();
  const topCalc = ((startDateHours - startHour) + (startDateMinutes / 60));

  const heightCalc = (durationTime) / 60;
  const totalHours = (endHour - startHour) + 1;

  const top = `${(topCalc / totalHours) * 100}%`;
  const left = `${(columnWidth * practIndex)}%`;
  const width = `${columnWidth}%`;
  const height = `${(heightCalc / totalHours) * 100}%`;

  // main app style
  let appStyle = {
    top,
    left,
    height,
    width,
    backgroundColor: `${hexToRgbA(bgColor, 0.6)}`,
    border: `1.5px solid ${bgColor}`,
  };

  // calculating the buffer position and height styling
  const heightCalcBuffer = ((customBufferTime / 60) / totalHours) * 100;
  const topBuffer = `${((topCalc / totalHours) * 100) + ((heightCalc / totalHours) * 100)}%`
  let bufferStyle = {
    top: topBuffer,
    left,
    width,
    height: `${heightCalcBuffer}%`,
    backgroundColor: '#b4b4b5',
  };

  // dealing with split appointment styling
  if (isSplit) {
    const adjacentSplit = !adjacent ? (columnWidth * 0.5) : 0;
    const leftSplit = `${(columnWidth * practIndex) + adjacentSplit}%`;
    const widthSplit = `${columnWidth * 0.5}%`;

    appStyle = Object.assign({}, appStyle, {
      left: leftSplit,
      width: widthSplit,
      overflow: 'auto',
    });

    bufferStyle = Object.assign({}, bufferStyle, {
      left: leftSplit,
      width: widthSplit,
    });
  }

  return (
    <div
      onClick={() => {
        selectAppointment(appointment);
      }}
    >
      <div
        key={appointment.id}
        className={styles.showAppointment}
        style={appStyle}
      >
        <div className={styles.showAppointment_icon}>
          {(isPatientConfirmed && <Icon icon="check-circle-o" />)}
        </div>
        <div className={styles.showAppointment_nameAge}>
          <div className={styles.showAppointment_nameAge_name} >
            <span className={styles.paddingText}>{patient.firstName}</span>
            <span className={styles.paddingText}>{patient.lastName},</span>
            <span>{age}</span>
          </div>
        </div>
        <div className={styles.showAppointment_duration}>
          <span>{moment(startDate).format('h:mm')}-{moment(endDate).format('h:mm a')}</span>
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

ShowAppointment.propTypes = {
  appointment: PropTypes.object,
  bgColor: PropTypes.string,
  practIndex: PropTypes.number,
  selectAppointment: PropTypes.func.isRequired,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  columnWidth: PropTypes.number,
};
