
import React, { Component, PropTypes } from 'react';
import {Card, Tabs, Tab, List} from '../library';
import moment from 'moment';


class RequestListItem extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }


  handleChange(){
    console.log("Working Button");
  }

  render() {
    const { request } = this.props;

    const startDate = moment().format(request.startTime);


    return (
      <Card>
        <List>
          <span>{startDate}</span>
          <span>{request.title}</span>
        </List>
      </Card>
    );
  }
}

RequestListItem.propTypes = {};


export default RequestListItem;