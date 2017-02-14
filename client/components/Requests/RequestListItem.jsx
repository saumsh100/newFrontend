
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';


export default function RequestListItem({ request, patient, service, practitioner,}) {

  const data = {
    time: request.getFormattedTime(),
    nameAge: patient.getFullName().concat(', ', request.getAge(patient.birthday)),
    email: patient.email,
    service: service.name,
    phoneNumber: patient.phoneNumber,
    insurance: patient.getInsurance().insurance,
    comment: request.comment,
    month: request.getMonth(),
    day: request.getDay(),
  };

  const showResults = true;

  return (
    <div>
      <ListItem className={styles.requestListItem}>
        <MonthDay month={data.month} day={data.day} />
        <RequestData data={data} />
      </ListItem>
      {showResults ? <AppointmentShowData data={data} />: null }
    </div>
  );
}



RequestListItem.propTypes = {};
