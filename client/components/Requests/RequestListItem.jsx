
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './style.scss';

export default function RequestListItem({ request, patient, service }) {
  const currentYear =  new Date().getFullYear();
  const birthday = moment(patient.birthDate).year();
  const age = currentYear - birthday;

  // TODO: use moment.js to format full Date string
  const startTime = moment(request.startTime);
  const month = startTime.format('MMM');
  const day = startTime.day();

  const startHourMinute = startTime.format('h:mm');
  const endHourMinute = moment(request.endTime).format('h:mm');
  const time = startHourMinute.concat('-', endHourMinute);

  const data = {
    time: time,
    nameAge: patient.firstName.concat(' ', patient.lastName, ', ', age),
    service: service.name,
    phoneNumber: patient.phoneNumber,
  };

  return (
    <ListItem className={styles.requestListItem}>
      <MonthDay month={month} day={day} />
      <RequestData data={data} />
    </ListItem>
  );
}

RequestListItem.propTypes = {};
