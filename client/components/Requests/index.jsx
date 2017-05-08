
import React, { Component, PropTypes } from 'react';
import RequestList from './RequestList';
import { Card, CardHeader } from '../library';
import styles from './styles.scss';

class Requests extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { requests, patients, services } = this.props;

    const filteredRequests = requests.toArray().filter((req) => {
      return !req.get('isCancelled');
    })

    const sortedRequests = filteredRequests.sort((a, b) => {
      return Date.parse(b.startDate) - Date.parse(a.startDate);
    });

    return (
      <Card className={styles.requestCard}>
        <div className={`${this.props.className} ${styles.requestCard__wrapper}`}>
          <div className={styles.requestHeader}>
            <CardHeader count={sortedRequests.length} title={'New Appointment Requests'} />
          </div>
          <div className={styles.requestBody}>
            <RequestList
              sortedRequests={sortedRequests}
              patients={patients}
              services={services}
            />
          </div>
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
