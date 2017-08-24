
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Avatar, Icon, Button, Toggle } from '../../library';
import classnames from 'classnames';
import styles from '../styles.scss';

export default function CallerDisplay({ call, patient, patientIdStats, clearSelectedChat}) {

  const age = moment().diff(patient.birthDate, 'years');
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const fullNameDisplay = age ? fullName.concat(', ', age) : fullName;
  const birthDate = moment(patient.birthDate).format('MMMM Do, YYYY');

  const lastAppt = patientIdStats ? moment(patientIdStats.get('lastAppointment')).format('MMM Do, YYYY h:mm a') : '-';
  const nextAppt = patientIdStats ? moment(patientIdStats.get('nextAppointment')).format('MMM Do, YYYY h:mm a') : '-';

  return (
    <div className={styles.callDisplayContainer} >
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
            <div className={styles.appointmentInfoContainer_date}>{lastAppt}</div>
          </div>
          <div className={styles.appointmentInfoContainer_next} >
            <span>Next Appointment </span>
            <div className={styles.appointmentInfoContainer_date}>{nextAppt}</div>
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
        <div className={styles.toggleContainer}>
          <span className={styles.toggleContainer_text}> Was Appointment Booked? </span>
          <div className={styles.toggleContainer_toggle}>
            <Toggle
              defaultChecked={call.wasApptBooked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CallerDisplay.propTypes = {
  call: PropTypes.object,
  patient: PropTypes.object,
};
