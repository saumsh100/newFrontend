
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Card, Avatar, Icon } from '../../../library';
import styles from './styles.scss';

export default function TopDisplay(props) {
  const {
    patient
  } = props;

  const age = patient && patient.birthDate ? moment().diff(patient.birthDate, 'years') : '';

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          &nbsp;
        </div>
        <div className={styles.dataContainer}>

          <div className={styles.avatarContainer}>
            <Avatar user={patient} className={styles.avatarContainer_avatar} />
            <div className={styles.avatarContainer_data}>
              <div className={styles.avatarContainer_data_name}>
                {patient.getFullName()}, {age}
              </div>
              <div className={styles.displayFlex}>
                <span className={styles.avatarContainer_data_icon}> <Icon icon="envelope" /> </span>
                <div className={styles.avatarContainer_data_email}>
                  {patient.email}
                </div>
              </div>
              <div className={styles.displayFlex}>
                <span className={styles.avatarContainer_data_icon}> <Icon icon="phone" /> </span>
                <div className={styles.avatarContainer_data_phone}>
                  {patient.mobilePhoneNumber}
                </div>
              </div>
              <div className={styles.avatarContainer_data_active}>
                {patient.status}
              </div>
            </div>
          </div>


        </div>
      </div>
    </Card>
  );
}
