
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List, ListItem} from '../library';
import moment from 'moment';

import styles from './style.scss';


class RequestListItem extends Component {
  constructor(props) {
    super(props);

    this.monthDayComponent = this.monthDayComponent.bind(this);
    this.dataComponent = this.dataComponent.bind(this);

  }

  monthDayComponent(month, day){

    if (month && day) {
      monthDayComponent = (
        <div className={styles.monthDay}>
          <div className={styles.monthDay__month}>
            {month}
          </div>
          <div className={styles.monthDay__day}>
            {day}
          </div>
        </div>
      );
    }
    return monthDayComponent;
  }

  dataComponent(data){

    if (data) {
      dataComponent = (
        <div className={styles.requestData}>
          <div className={styles.requestData__time}>{data.time}</div>
          <div className={styles.requestData__nameAge}>{data.nameAge}</div>
          <div className={styles.requestData__phoneNumber}>{data.phoneNumber}</div>
          <div className={styles.requestData__service}>{data.service}</div>
        </div>
      );
    }
    return dataComponent;
  }

  render() {

    const { request, patient, service } = this.props;

    const currentYear =  new Date().getFullYear();
    const birthday = moment(patient.birthday).year();
    const age = currentYear - birthday;

    // TODO: use moment.js to format full Date string
    const startTime = moment(request.startTime);
    const month = startTime.format("MMM");
    const day = startTime.day();

    const startHourMinute = startTime.format("h:mm");
    const endHourMinute = moment(request.endTime).format("h:mm");
    const time = startHourMinute.concat('-', endHourMinute);

    let monthDayComponent = this.monthDayComponent(month, day);

    let data = {
      time: time,
      nameAge: patient.firstName.concat(' ', patient.lastName, ', ', age),
      service: service.name,
      phoneNumber: patient.phoneNumber,
    };

    let dataComponent = this.dataComponent(data);

    return (
      <ListItem className={styles.requestListItem}>
        {monthDayComponent}
        {dataComponent}
      </ListItem>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;