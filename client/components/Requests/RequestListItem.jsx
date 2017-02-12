
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { ListItem } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './style.scss';
import RequestShowData from './RequestShowData';

export default function RequestListItem({ request, patient, service, practitioner,}) {
  const currentYear =  new Date().getFullYear();
  const birthday = moment(patient.birthday).year();
  const age = currentYear - birthday;

  // TODO: use moment.js to format full Date string
  const startTime = moment(request.startTime);
  const month = startTime.format("MMM");
  const day = startTime.date(day);
  const startHourMinute = startTime.format("h:mm");
  const endHourMinute = moment(request.endTime).format("h:mm");

  const data = {
    time: startHourMinute.concat('-', endHourMinute),
    nameAge: patient.firstName.concat(' ', patient.lastName, ', ', age),
    email: patient.email,
    service: service.name,
    phoneNumber: patient.phoneNumber,
    insurance: patient.getInsurance().insurance,
  };

  const showResults = true;

  return (
    <div>
      <ListItem className={styles.requestListItem}>
        <MonthDay month={month} day={day} />
        <RequestData data={data} />
      </ListItem>
      { showResults ? <RequestShowData data={data} />: null }
    </div>
  );
}

RequestListItem.propTypes = {};
