import { set } from 'lodash'
import React, { Component, PropTypes } from 'react';
import { ListItem, Button, Avatar } from '../../library';
import styles from './styles.scss';

export default function PatientData(props) {
  const {
    patient,
    requestData,
    handleUpdatePatient,
  } = props;

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const futureAppointments = patient.appointments && patient.appointments.length ? patient.appointments : false;

  const appointment = {
    startDate: requestData.startDate,
    endDate: requestData.endDate,
    serviceId: requestData.serviceId,
    note: requestData.note,
    isSyncedWithPms: false,
    customBufferTime: 0,
    request: true,
    patientId: patient.id,
    requestModel: requestData.requestModel,
    practitionerId: requestData.practitionerId,
    nextAppt: futureAppointments,
  };


  return (
    <ListItem
      className={styles.suggestionsListItem}>
      <Avatar size={'md'} className={styles.patientContainer_img} user={patient} alt="" />
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
      <Button
        onClick={() => {
          handleUpdatePatient(appointment);
        }}
        className={styles.connectButton}
        data-test-id={`${patient.firstName}${patient.lastName}`}
        color="blue"
      >
        Connect
      </Button>
    </ListItem>
  );
}

PatientData.propTypes = {
};
