
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import styles from '../styles.scss';
import { Icon } from '../../../library';
import withHoverable from '../../../../hocs/withHoverable'

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

function ShowAppointment(props) {
  const {
    appointment,
    practIndex,
    selectAppointment,
    startHour,
    endHour,
    columnWidth,
    widthIntersect,
    rowSort,
    isHovered,
  } = props;

  const {
    startDate,
    endDate,
    customBufferTime,
    serviceData,
    chairData,
    patientData,
    practitionerData,
    isPatientConfirmed,
    isReminderSent,
  } = appointment;

  if (!patientData) {
    return null;
  }

  let appPosition = 0;
  rowSort.map((app, index) => {
    if (appointment.id === app.id) {
      appPosition = index;
    }
  });

  const bgColor = practitionerData.color;
  const patient = patientData.toJS();
  const age = moment().diff(patient.birthDate, 'years') || '';
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  // Calculating the top position and height of the appointment.
  const durationTime = getDuration(startDate, endDate, customBufferTime);
  const startDateHours = moment(startDate).hours();
  const startDateMinutes = moment(startDate).minutes();
  const topCalc = ((startDateHours - startHour) + (startDateMinutes / 60));

  const heightCalc = (durationTime) / 60;
  const totalHours = (endHour - startHour) + 1;

  // const adjacentWidth = rowSort.length === 1 ? widthIntersect : rowSort.length

  const splitRow = rowSort.length > 1 ? (columnWidth * (appPosition / (rowSort.length))) : 0;
  const top = `${((topCalc / totalHours) * 100) + 0.05}%`;
  const left = `${((columnWidth * practIndex) + splitRow) + 0.05}%`;
  const width = `${(columnWidth * ((100 / rowSort.length) / 100)) - 0.15}%`;
  const height = `${((heightCalc / totalHours) * 100) - 0.1}%`;

  const backgroundColor = bgColor; //isHovered ? bgColor : hexToRgbA(bgColor, 0.6);
  const zIndex = isHovered ? 5 : appPosition;
  // main app style
  const appStyle = {
    top,
    left,
    height,
    width,
    backgroundColor,
    border: `1.5px solid ${bgColor}`,
    zIndex,
  };

  // calculating the buffer position and height styling
  const heightCalcBuffer = ((customBufferTime / 60) / totalHours) * 100;
  const topBuffer = `${(((topCalc / totalHours) * 100) + ((heightCalc / totalHours) * 100)) - 0.05}%`;

  const bufferStyle = {
    top: topBuffer,
    left,
    width,
    height: `${heightCalcBuffer}%`,
    backgroundColor: '#b4b4b5',
    zIndex,
  };

  const nameColor = {
    color: isHovered ? '#fafafa' : '#ededed',
  };

  return (
    <div
      key={appointment.id}
      onClick={() => {
        selectAppointment(appointment);
      }}
      className={styles.appointmentContainer}
    >
      <div
        key={appointment.id}
        className={styles.showAppointment}
        style={appStyle}
        data-test-id={`timeSlot${patient.firstName}${patient.lastName}`}
      >
        <div className={styles.showAppointment_icon}>
          <div className={styles.showAppointment_icon_item}>{(isPatientConfirmed && <Icon size={1.3} icon="check-circle-o" />)}</div>
          <div className={styles.showAppointment_icon_item}> {(isReminderSent && <Icon size={1.3} icon="clock-o" />)} </div>
        </div>
        <div className={styles.showAppointment_nameAge}>
          <div className={styles.showAppointment_nameAge_name} style={nameColor} >
            <span className={styles.paddingText}>{patient.firstName}</span>
            <span className={styles.paddingText}>{lastName}</span>
            <span>{age || ''}</span>
          </div>
        </div>
        <div className={styles.showAppointment_duration}>
          <span className={styles.showAppointment_duration_text}>
            {moment(startDate).format('h:mm')}-{moment(endDate).format('h:mm a')}
          </span>
        </div>
        <div className={styles.showAppointment_serviceChair}>
          <span className={styles.showAppointment_serviceChair_service}>{serviceData},</span>
          <span className={styles.showAppointment_serviceChair_chair}>{chairData}</span>
        </div>
      </div>
      <div className={styles.showAppointment} style={bufferStyle}>
        {''}
      </div>
    </div>
  );
}

ShowAppointment.propTypes = {
  appointment: PropTypes.object.isRequired,
  bgColor: PropTypes.string,
  practIndex: PropTypes.number,
  patient: PropTypes.object.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  columnWidth: PropTypes.number,
};

export default withHoverable(ShowAppointment);
