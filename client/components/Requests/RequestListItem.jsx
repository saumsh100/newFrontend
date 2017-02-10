
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List, ListItem} from '../library';
import moment from 'moment';
import styles from './style.scss';


class RequestListItem extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange() {
    console.log("Working Button");
  }

  render() {

    const { request, patient, service } = this.props;

    const currentYear =  new Date().getFullYear();
    const birthday = moment(patient.birthday).year();
    const age = currentYear - birthday;

    const startTime = moment(request.startTime);
    const month = startTime.format("MMM");
    const day = startTime.day();
    const startHourMinute = startTime.format("h:mm");
    const endHourMinute = moment(request.endTime).format("h:mm");

    // <ListItem>{patient.firstName}&nbsp;{patient.lastName}</ListItem>
    return (
        <List className={styles.monthDay}>
          <ListItem className={styles.monthDay__month}>{month}</ListItem>
          <ListItem className={styles.monthDay__day}>{day}</ListItem>
        </List>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;