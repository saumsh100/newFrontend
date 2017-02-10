
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List, ListItem} from '../library';
import moment from 'moment';


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

    // TODO: use moment.js to format full Date string
    const startTime = moment(request.startTime);
    const month = startTime.format("MMM");
    const day = startTime.day();
    const startHourMinute = startTime.format("h:mm");
    const endHourMinute = moment(request.endTime).format("h:mm");

    return (
      <ListItem>
        <div>{month}&nbsp;{day}&nbsp;{age}</div>
        <div>{patient.firstName}&nbsp;{patient.lastName}</div>
      </ListItem>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;