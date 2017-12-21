
import React, { Component } from 'react';
import moment from 'moment';
import { ListItem, Icon, Avatar } from '../../../library';
import styles from './styles.scss';
import Input from "../../../library/Input/index";

export default function ReminderData(props) {
  const {
    patient,
    reminder,
    sentReminder,
    index,
    handleReminderClick,
    handleAppointmentClick,
    appointment,
  } = props;

  const displayStatus = sentReminder.isConfirmed ? 'Reminder Confirmed' : 'Reminder Sent';

  let icon = reminder ? reminder.toJS().primaryType.toLowerCase() : null;

  if (icon === 'sms') {
    icon = 'comment';
  } else if (icon === 'email') {
    icon = 'envelope';
  }

  const age = moment().diff(patient.birthDate, 'years');

  return (
    <ListItem
      key={`patientsItem${index}`}
      className={styles.patients__item}
      data-test-id={`${index}_sentReminder`}
    >
      <Avatar className={styles.patients__item_img} size="md" user={patient} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <a
              className={styles.patients__item_name}
              onClick={() => handleReminderClick(patient.id)}
              href="#"
            >
              <span className={styles.patients__item_name_first}>{patient.firstName}</span>
              <span>{patient.lastName}</span>
              <span>, {age}</span>
            </a>
          </div>
          <div
            className={styles.patients__item_appt}
            onClick={(e)=>{
              e.stopPropagation();
              handleAppointmentClick(appointment.startDate);
            }}
          >
            <Icon icon="calendar" size={1} />
            <span className={styles.patients__item_appt_text}>
              {appointment && moment(appointment.startDate).format('MM/DD/YYYY, h:mma')}
            </span>
          </div>
          <div className={styles.patients__item_phone}>
            {patient.mobilePhoneNumber}
          </div>
          <div className={styles.patients__item_email}>
            {patient.email}
          </div>
        </div>
        <div key={`patients${index}`} className={styles.patients__item_right}>
          <div className={styles.patients__item_status}>
            {displayStatus}
          </div>
          <div className={styles.patients__item_date}>
            {moment(sentReminder.createdAt).format('MM/DD/YYYY, h:mma')}
          </div>
        </div>
      </div>
      <div className={styles.patients__item_icon}>
        <Icon className={styles[`fa-${icon}`]} icon={icon} size={1.5} />
      </div>
    </ListItem>
  );
}
