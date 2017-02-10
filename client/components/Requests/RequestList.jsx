
import React, { Component, PropTypes } from 'react';
import RequestListItem from './RequestListItem';
import { CardHeader} from '../library';


class RequestList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const requests = this.props.requests.toArray();
    requests.sort((a,b) => {
      return Date.parse(b.startTime) - Date.parse(a.startTime);
    });

    return (
      <div>
        <CardHeader title="New Appointment Requests" count={requests.length}/>
        {requests.map((request) => {
          return (
            <RequestListItem
              key={request.id}
              request={request}
              patient={this.props.patients.get(request.get('patientId'))}
              service={this.props.services.get(request.get('serviceId'))}
            />
          );
        })}
      </div>
    );
  }
}

RequestList.propTypes = {};

export default RequestList;
