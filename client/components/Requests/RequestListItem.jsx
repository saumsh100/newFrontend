
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List} from '../library';
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
    const { request, patient } = this.props;

    const startDate = moment(request.startTime).format("MMM Do YYYY");

    return (
      <Card>
        <List>
          <div>{startDate}</div>
          <div>{request.title}</div>
          <div>{patient.firstName}</div>
        </List>
      </Card>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;