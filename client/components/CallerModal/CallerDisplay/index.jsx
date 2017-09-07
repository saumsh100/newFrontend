
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Avatar, Icon, Button, Toggle } from '../../library';
import classnames from 'classnames';
import AppointmentBookedToggle from './AppointmentBookedToggle';
import styles from '../styles.scss';

export default function CallerDisplay(props) {
  const {
    call,
    patient,
    patientIdStats,
    clearSelectedChat,
    updateEntityRequest,
    push,
    setScheduleDate,
  } = props;

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

  const age = moment().diff(patient.birthDate, 'years');
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const fullNameDisplay = age ? fullName.concat(', ', age) : fullName;
  const birthDate = moment(patient.birthDate).format('MMMM Do, YYYY');

  const lastAppt = patientIdStats && patientIdStats.get('lastAppointment') ?
    moment(patientIdStats.get('lastAppointment')).format('MMM Do, YYYY h:mm a') : '-';
  const nextAppt = patientIdStats && patientIdStats.get('nextAppointment') ?
    moment(patientIdStats.get('nextAppointment')).format('MMM Do, YYYY h:mm a') : '-';

  let nextApptStyling = styles.appointmentInfoContainer_date;
  let lastApptStyling = styles.appointmentInfoContainer_date;

  if (nextAppt !== '-') {
    nextApptStyling = classnames(nextApptStyling, styles.appointmentInfoContainer_date_hover);
  }
  if (lastAppt !== '-') {
    lastApptStyling = classnames(lastApptStyling, styles.appointmentInfoContainer_date_hover);
  }
  return (
    <div className={callDisplayContainer} >
      <div className={styles.headerContainer}>
        <Avatar user={patient} size={"lg"} className={styles.callerAvatar} />
        <div
          className={styles.closeIcon}
          onClick={clearSelectedChat}
        >
          x
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
        <div className={styles.iconContainer} >
          <Icon size={2} icon="phone" />
        </div>
        <div className={styles.appointmentInfoContainer}>
          <div className={styles.appointmentInfoContainer_last} >
            <span>Last Appointment </span>
            <div
              className={lastApptStyling}
              onClick={() => {
                if (lastAppt !== '-') {
                  setScheduleDate({ scheduleDate: moment(patientIdStats.get('lastAppointment')) });
                  clearSelectedChat();
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
                if (nextAppt !== '-') {
                  setScheduleDate({ scheduleDate: moment(patientIdStats.get('nextAppointment')) });
                  clearSelectedChat();
                  push('/schedule');
                }
              }}
            >
              {nextAppt}
            </div>
          </div>
        </div>

        <div className={styles.callInfo_header} >Call Information</div>
        <div className={styles.callInfo}>
          <div className={styles.callInfo_content}>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Number: </div>
              <div className={styles.callInfo_data}>{call.callerNum}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>City: </div>
              <div className={styles.callInfo_data}>{call.callerCity}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Country: </div>
              <div className={styles.callInfo_data}>{call.callerCountry}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>State: </div>
              <div className={styles.callInfo_data}>{call.callerState}</div>
            </div>
          </div>
          <div className={styles.callInfo_content2}>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Zip: </div>
              <div className={styles.callInfo_data}>{call.callerZip}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Duration: </div>
              <div className={styles.callInfo_data}>{call.duration}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Source: </div>
              <div className={styles.callInfo_data}>{call.callSource}</div>
            </div>
            <div className={styles.callInfo_body}>
              <div className={styles.callInfo_desc}>Total Calls: </div>
              <div className={styles.callInfo_data}>{call.totalCalls}</div>
            </div>
          </div>
        </div>
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
  patientIdStats: PropTypes.object,
  clearSelectedChat: PropTypes.func,
  push: PropTypes.func,
  setScheduleDate: PropTypes.func,
};
