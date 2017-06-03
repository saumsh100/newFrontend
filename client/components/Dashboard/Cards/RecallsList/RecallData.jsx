
import React, { Component } from 'react';
import { ListItem,  Icon } from '../../../library';
import styles from './styles.scss';

export default function RecallData(props) {
  const {
    patient,
    recall,
    sentRecall,
    index,
    handleRecallClick,
  } = props;

  const displayStatus = sentRecall.isConfirmed ? 'Recall Confirmed' : 'Recall Sent';
  const icon = (recall.primaryType === 'PHONE') && 'phone';

  return (
    <ListItem
      key={`patientsItem${index}`}
      className={styles.patients__item}
      onClick={() => handleRecallClick(patient.id)}
    >
      <img className={styles.patients__item_img} src={patient.avatarUrl || '/images/avatar.png'} alt="" />
      <div className={styles.patients__item_wrapper}>
        <div className={styles.patients__item_left}>
          <div className={styles.patients__item_name}>
            <b>{patient.firstName}, <span>{patient.lastName}</span></b>
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
            33
          </div>
          <div className={styles.patients__item_time}>
            33
          </div>
        </div>
      </div>
      <div className={styles.patients__item_icon}>
        <Icon className={styles[`fa-${icon || recall.primaryType}`]} icon={icon} size={1.5} />
      </div>
    </ListItem>
  );
}
