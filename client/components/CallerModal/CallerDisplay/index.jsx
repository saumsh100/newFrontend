
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Avatar, Icon } from '../../library';
import AppointmentBookedToggle from './AppointmentBookedToggle';
import CallDisplayInfo from '../CallDisplayInfo';
import styles from '../styles.scss';

export default function CallerDisplay(props) {
  const {
    call,
    patient,
    clearSelectedCall,
    updateEntityRequest,
    push,
    setScheduleDate,
  } = props;

  if (!patient) {
    return null;
  }

  const isAnswered = call.answered;
  const isCallFinished = call.duration > 0;

  let borderStyling = null;
  if (!isAnswered && !isCallFinished) {
    // call incoming
    borderStyling = styles.incoming;
  } else if (isCallFinished && isAnswered) {
    // call ended
    borderStyling = styles.ended;
  } else {
    // call missed
    borderStyling = styles.missed;
  }

  const callDisplayContainer = classnames(
    styles.callDisplayContainer,
    borderStyling,
  );

  const age =
    patient && patient.birthDate
      ? moment().diff(patient.birthDate, 'years')
      : null;
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const fullNameDisplay = age ? fullName.concat(', ', age) : fullName;
  const birthDate =
    patient && patient.birthDate
      ? moment(patient.birthDate).format('MMMM Do, YYYY')
      : null;

  const lastAppt =
    patient && patient.lastApptDate
      ? moment(patient.lastApptDate).format('MMM Do, YYYY h:mm a')
      : null;
  const nextAppt =
    patient && patient.nextApptDate
      ? moment(patient.nextApptDate).format('MMM Do, YYYY h:mm a')
      : null;

  let nextApptStyling = styles.appointmentInfoContainer_date;
  let lastApptStyling = styles.appointmentInfoContainer_date;

  if (nextAppt) {
    nextApptStyling = classnames(
      nextApptStyling,
      styles.appointmentInfoContainer_date_hover,
    );
  }
  if (lastAppt) {
    lastApptStyling = classnames(
      lastApptStyling,
      styles.appointmentInfoContainer_date_hover,
    );
  }

  return (
    <div className={callDisplayContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.callerAvatar}>
          <Avatar user={patient} size="xl" />
        </div>
        <div className={styles.closeIcon} onClick={clearSelectedCall}>
          <Icon icon="times" />
        </div>
      </div>
      <div className={styles.callBody}>
        <div className={styles.patientInfoContainer}>
          <div className={styles.patientNameAge}>
            <span>{fullNameDisplay}</span>
          </div>
          <div className={styles.patientBirthday}>
            <span>{birthDate} </span>
          </div>
          <div className={styles.patientBirthday}>
            <span>{patient.gender}</span>
          </div>
        </div>
        <div className={styles.iconContainer}>
          <Icon size={2} icon="phone" />
        </div>
        <div className={styles.appointmentInfoContainer}>
          <div className={styles.appointmentInfoContainer_last}>
            <span>Last Appointment </span>
            <div
              className={lastApptStyling}
              onClick={() => {
                if (lastAppt) {
                  setScheduleDate({ scheduleDate: lastAppt });
                  clearSelectedCall();
                  push('/schedule');
                }
              }}
            >
              {lastAppt}
            </div>
          </div>
          <div className={styles.appointmentInfoContainer_next}>
            <span>Next Appointment </span>
            <div
              className={nextApptStyling}
              onClick={() => {
                if (nextAppt) {
                  setScheduleDate({ scheduleDate: nextAppt });
                  clearSelectedCall();
                  push('/schedule');
                }
              }}
            >
              {nextAppt}
            </div>
          </div>
        </div>

        <div className={styles.callInfo_header}>Call Information</div>
        <CallDisplayInfo call={call} />
        <AppointmentBookedToggle
          call={call}
          updateEntityRequest={updateEntityRequest}
        />
      </div>
    </div>
  );
}

CallerDisplay.propTypes = {
  call: PropTypes.object,
  patient: PropTypes.object,
  clearSelectedCall: PropTypes.func,
  push: PropTypes.func,
  setScheduleDate: PropTypes.func,
  updateEntityRequest: PropTypes.func,
};
