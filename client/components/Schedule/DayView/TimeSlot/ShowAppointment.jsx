
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from '../styles.scss';
import { Icon } from '../../../library';
import Popover from 'react-popover';
import withHoverable from '../../../../hocs/withHoverable';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

function ShowAppointment(props) {
  const {
    appointment,
    selectAppointment,
    startHour,
    rowSort,
    isHovered,
    timeSlotHeight,
  } = props;

  const {
    startDate,
    endDate,
    customBufferTime,
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
  const topCalc = (((startDateHours - startHour) + (startDateMinutes / 60)) * timeSlotHeight.height) // + timeSlotHeight.height;
  const heightCalc = ((durationTime) / 60) * timeSlotHeight.height;

  // const adjacentWidth = rowSort.length === 1 ? widthIntersect : rowSort.length

  const splitRow = rowSort.length > 1 ? (100 * (appPosition / (rowSort.length))) : 0;
  const top = `${(topCalc + 0.05)}px`;
  const left = `${(0 + splitRow) + 0.07}%`;
  const width = `${(100 * ((100 / rowSort.length) / 100)) - 0.16}%`;
  const height = `${heightCalc - 0.1}px`;

  const backgroundColor = bgColor; // isHovered ? bgColor : hexToRgbA(bgColor, 0.6);
  const zIndex = isHovered ? 5 : appPosition;
  // main app style
  const appStyle = {
    height,
    backgroundColor,
    border: `0.5px solid ${appPosition === 0 ? bgColor : '#FFFFFF'}`,
    zIndex,
  };

  // calculating the buffer position and height styling
  const heightCalcBuffer = (customBufferTime / 60) * timeSlotHeight.height;

  const bufferStyle = {
    width: '100%',
    height: `${heightCalcBuffer}px`,
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
      style={{ height: `${(heightCalc - 0.1) + heightCalcBuffer}px`, top, width, left }}
    >
      <div
        key={appointment.id}
        className={styles.showAppointment}
        style={appStyle}
        data-test-id={`timeSlot${patient.firstName}${patient.lastName}`}
      >
        {isPatientConfirmed || isReminderSent ? (<div className={styles.showAppointment_icon}>
          <div className={styles.showAppointment_icon_item}>{(isPatientConfirmed && <Icon size={1} icon="check-circle" />)}</div>
          <div className={styles.showAppointment_icon_item}> {(isReminderSent && <Icon size={1} icon="clock-o" />)} </div>
        </div>) : null}
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
        {/*<div className={styles.showAppointment_serviceChair}>
          {/*<span className={styles.showAppointment_serviceChair_service}>{serviceData},</span>
          <span className={styles.showAppointment_serviceChair_chair}>{chairData}</span>
        </div>*/}
      </div>
      <div className={styles.showAppointment_buffer} style={bufferStyle}>
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
  rowSort: PropTypes.array(Array),
  isHovered: PropTypes.bool,
  timeSlotHeight: PropTypes.object,
};

export default withHoverable(ShowAppointment);
