
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Avatar, getFormattedDate, getTodaysDate, Icon } from '../../library';
import AppointmentBookedToggle from './AppointmentBookedToggle';
import CallDisplayInfo from '../CallDisplayInfo';
import styles from '../styles.scss';
import { callShape, patientShape } from '../../library/PropTypeShapes';

const CallerDisplay = ({
  call,
  patient,
  clearSelectedCall,
  updateEntityRequest,
  push,
  setScheduleDate,
  timezone,
}) => {
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

  const callDisplayContainer = classnames(styles.callDisplayContainer, borderStyling);

  const age = patient.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : null;

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const fullNameDisplay = age ? fullName.concat(', ', age) : fullName;
  const birthDate = patient.birthDate
    ? getFormattedDate(patient.birthDate, 'MMMM Do, YYYY', timezone)
    : null;

  const lastAppt = patient.lastApptDate
    ? getFormattedDate(patient.lastApptDate, 'MMM Do, YYYY h:mm a', timezone)
    : null;

  const nextAppt = patient.nextApptDate
    ? getFormattedDate(patient.nextApptDate, 'MMM Do, YYYY h:mm a', timezone)
    : null;

  let nextApptStyling = styles.appointmentInfoContainer_date;
  let lastApptStyling = styles.appointmentInfoContainer_date;

  if (nextAppt) {
    nextApptStyling = classnames(nextApptStyling, styles.appointmentInfoContainer_date_hover);
  }
  if (lastAppt) {
    lastApptStyling = classnames(lastApptStyling, styles.appointmentInfoContainer_date_hover);
  }

  const onClick = (scheduleDate) => {
    if (lastAppt) {
      setScheduleDate({ scheduleDate });
      clearSelectedCall();
      push('/schedule');
    }
  };

  const onKeyPress = (e, scheduleDate) => {
    if (e.keyCode === 13 && lastAppt) {
      e.stopPropagation();
      onClick(scheduleDate);
    }
  };

  return (
    <div className={callDisplayContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.callerAvatar}>
          <Avatar user={patient} size="xl" />
        </div>
        <div
          className={styles.closeIcon}
          onClick={clearSelectedCall}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.keyCode === 13 && clearSelectedCall()}
        >
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
              onClick={() => onClick(lastAppt)}
              role="button"
              tabIndex={0}
              onKeyDown={e => onKeyPress(e, lastAppt)}
            >
              {lastAppt}
            </div>
          </div>
          <div className={styles.appointmentInfoContainer_next}>
            <span>Next Appointment </span>
            <div
              className={nextApptStyling}
              onClick={() => onClick(nextAppt)}
              role="button"
              tabIndex={0}
              onKeyDown={e => onKeyPress(e, nextAppt)}
            >
              {nextAppt}
            </div>
          </div>
        </div>

        <div className={styles.callInfo_header}>Call Information</div>
        <CallDisplayInfo call={call} />
        <AppointmentBookedToggle call={call} updateEntityRequest={updateEntityRequest} />
      </div>
    </div>
  );
};

CallerDisplay.propTypes = {
  call: PropTypes.shape(callShape),
  patient: PropTypes.shape(patientShape),
  clearSelectedCall: PropTypes.func,
  push: PropTypes.func,
  setScheduleDate: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  timezone: PropTypes.string.isRequired,
};

CallerDisplay.defaultProps = {
  call: null,
  patient: null,
  clearSelectedCall: () => {},
  push: () => {},
  setScheduleDate: () => {},
  updateEntityRequest: () => {},
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(CallerDisplay);
