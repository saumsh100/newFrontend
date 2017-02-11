
import React, { Component, PropTypes } from 'react';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './style.scss';


class RequestList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sortedRequests = this.props.requests.sort((a, b) => {
      return Date.parse(b.startTime) - Date.parse(a.startTime);
    });

    return (
        <List className={styles.requestList}>
          {sortedRequests.toArray().map((request) => {
            return (
              <RequestListItem
                key={request.id}
                request={request}
                patient={this.props.patients.get(request.get('patientId'))}
                service={this.props.services.get(request.get('serviceId'))}
              />
            );
          })}
        </List>
    );
  }
}

RequestList.propTypes = {};

export default RequestList;
