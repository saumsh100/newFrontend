import { set } from 'lodash'
import React, { Component, PropTypes } from 'react';
import { ListItem } from '../../library';
import styles from './styles.scss'

export default function PatientData(props) {
  const {
    patient,
    reinitializeState,
    selectAppointment,
    requestData,
  } = props;

  const fullName = `${patient.firstName} ${patient.lastName}`;

  const modifiedRequest = {
    startDate: requestData.startDate,
    endDate: requestData.endDate,
    serviceId: requestData.serviceId,
    note: requestData.note,
    isSyncedWithPMS: false,
    customBufferTime: 0,
    request: true,
    patientId: patient.id,
  };

  return (
    <ListItem
      onClick={() => {
        reinitializeState();
        selectAppointment(modifiedRequest);
      }}
      className={styles.suggestionsListItem}
    >
      <img className={styles.patientContainer_img} src={patient.avatarUrl || '/images/avatar.png'} alt="" />
      <div className={styles.patientContainer} >
        <div className={styles.patientContainer_fullName}>
          {fullName}
        </div>
        <div className={styles.patientContainer_email}>
          {patient.email}
        </div>
        <div className={styles.patientContainer_phone}>
          {patient.mobilePhoneNumber}
        </div>
      </div>
    </ListItem>
  );
}

PatientData.propTypes = {
};
