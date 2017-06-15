
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';
import { Card, CardHeader } from '../library';
import styles from './styles.scss';

class Requests extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      requests,
      services,
      patientUsers,
      location,
    } = this.props;

    const filteredRequests = requests.toArray().filter((req) => {
      return !req.get('isCancelled') && !req.get('isConfirmed');
    })

    const sortedRequests = filteredRequests.sort((a, b) => {
      return Date.parse(b.startDate) - Date.parse(a.startDate);
    });

    return (
      <Card className={styles.requestCard}>
        <div className={styles.requestHeader}>
          <CardHeader count={sortedRequests.length} title={'Appointment Requests'} />
        </div>
        <div className={styles.requestBody}>
          <RequestList
            sortedRequests={sortedRequests}
            services={services}
            patientUsers={patientUsers}
            location={location}
          />
        </div>
      </Card>
    );
  }
}

Requests.propTypes = {
  requests: PropTypes.object,
  patients: PropTypes.object,
  services: PropTypes.object,
};

export default Requests;
