
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List, ListItem} from '../library';
import moment from 'moment';

import styles from './style.scss';


class RequestListItem extends Component {
  constructor(props) {
    super(props);

    this.monthDayComponent = this.monthDayComponent.bind(this);
  }

  monthDayComponent(month, day){

    let monthDayComponent = null;
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

    let monthDayComponent = this.monthDayComponent(month, day)


    return (
      <ListItem className={styles.requestListItem}>
        {monthDayComponent}
        <div>{patient.firstName}&nbsp;{patient.lastName}</div>
      </ListItem>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;