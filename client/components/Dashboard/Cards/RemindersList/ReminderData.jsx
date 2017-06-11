
import React, { Component } from 'react';
import moment from 'moment';
import { ListItem,  Icon } from '../../../library';
import styles from './styles.scss';

export default function ReminderData(props) {

  const {
    patient,
    reminder,
    appointment,
    sentReminder,
    index,
    handleReminderClick,
  } = props;

  const displayStatus = sentReminder.isConfirmed ? 'Reminder Confirmed' : 'Reminder Sent';

  let icon = reminder.primaryType.toLowerCase();
  if (icon === 'sms') {
    icon = 'comment';
  }

  const age = moment().diff(patient.birthDate, 'years');

  return (
    <ListItem
      key={`patientsItem${index}`}
      className={styles.patients__item}
    >
      <img className={styles.patients__item_img} src={patient.avatarUrl || '/images/avatar.png'} alt="" />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <a
              className={styles.patients__item_name}
              onClick={() => handleReminderClick(patient.id)}
              href="#"
            >
              <b>
                <span className={styles.patients__item_name_first}>{patient.firstName}</span>
                <span>{patient.lastName}</span>
                <span>, {age}</span>
              </b>
            </a>
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
            {moment(sentReminder.createdAt).format('MM/DD/YYYY')}
          </div>
        </div>
      </div>
      <div className={styles.patients__item_icon}>
        <Icon className={styles[`fa-${icon}`]} icon={icon} size={1.5} />
      </div>
    </ListItem>
  );
}
