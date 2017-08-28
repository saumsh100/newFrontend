
import React, { Component } from 'react';
import moment from 'moment';
import { ListItem,  Icon, Avatar } from '../../../library';
import styles from './styles.scss';

export default function RecallData(props) {
  const {
    patientJS,
    recallJS,
    sentRecall,
    index,
    handleRecallClick,
  } = props;

  const patient = patientJS.toJS();

  let icon = recallJS ? recallJS.toJS().primaryType.toLowerCase() : null;

  const displayStatus = sentRecall.isConfirmed ? 'Recall Confirmed' : 'Recall Sent';

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
      data-test-id={`${index}_sentRecall`}
    >
      <Avatar className={styles.patients__item_img} size="lg" user={patient} />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name} >
            <a
              className={styles.patients__item_name}
              onClick={() => handleRecallClick(patient.id)}
              href="#"
            >
              <span className={styles.patients__item_name_first}>{patient.firstName}</span>
              <span>{patient.lastName}</span>
              <span>, {age}</span>
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
            {moment(sentRecall.createdAt).format('MM/DD/YYYY, h:mma')}
          </div>
        </div>
      </div>
      <div className={styles.patients__item_icon}>
        <Icon className={styles[`fa-${icon}`]} icon={icon} size={1.5} />
      </div>
    </ListItem>
  );
}
