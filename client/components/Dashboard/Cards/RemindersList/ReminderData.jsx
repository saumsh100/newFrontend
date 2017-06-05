
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
    handleReminderClick
  } = props;

  const displayStatus = sentReminder.isConfirmed ? 'Reminder Confirmed' : 'Reminder Sent';
  const icon = (reminder.primaryType === 'sms') && 'comment';

  return (
    <ListItem
      key={`patientsItem${index}`}
      className={styles.patients__item}
    >
      <img className={styles.patients__item_img} src={patient.avatarUrl || '/images/avatar.png'} alt="" />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name} onClick={() => handleRecallClick(patient.id)}>
            <a href="#"><b>{patient.firstName}, <span>{patient.lastName}</span></b></a>
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
            {moment(appointment.startDate).format('L')}
          </div>
          <div className={styles.patients__item_time}>
            {moment(appointment.endDate).format('L')}
          </div>
        </div>
      </div>
      <div className={styles.patients__item_icon}>
        <Icon className={styles[`fa-${icon || reminder.primaryType}`]} icon={icon} size={1.5} />
      </div>
    </ListItem>
  );
}
