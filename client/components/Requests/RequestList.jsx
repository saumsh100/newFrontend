
import React, { Component, PropTypes } from 'react';
import RequestListItem from './RequestListItem';

class RequestList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const requests = this.props.requests.get('models').toArray();
    requests.sort((a,b) => {
      return Date.parse(b.startTime) - Date.parse(a.startTime);
    });

    return (
      <div>
        <h1> {requests.length} New Appointment Requests</h1>
        {requests.map((request) => {
          return (
            <RequestListItem
              key={request.id}
              request={request}
              patient={this.props.patients.get(request.get('patientId'))}
            />
          );
        })}
      </div>
    );
  }
}

RequestList.propTypes = {};

export default RequestList;
