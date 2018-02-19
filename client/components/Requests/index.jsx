
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import RequestList from './RequestList';
import { Card, CardHeader, IconButton } from '../library';
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
      practitioners,
      location,
      popoverRight,
      noBorder,
      disableHeader,
      runAnimation,
      isLoaded,
    } = this.props;

    const filteredRequests = requests.toArray().filter((req) => {
      return !req.get('isCancelled') && !req.get('isConfirmed');
    });

    const sortedRequests = filteredRequests.sort((a, b) => {
      return Date.parse(b.startDate) - Date.parse(a.startDate);
    });

    let requestHeaderClassNames = styles.requestHeader;
    if (disableHeader) {
      requestHeaderClassNames = classNames(requestHeaderClassNames, styles.hidden);
    }

    let display = (
      <RequestList
        sortedRequests={sortedRequests}
        services={services}
        patientUsers={patientUsers}
        location={location}
        practitioners={practitioners}
        popoverRight={popoverRight}
      />
    );

    if (filteredRequests.length === 0) {
      display = (
        <div className={styles.noRequests}>
          No Requests
        </div>
      );
    }
    return (
      <Card
        className={styles.requestCard}
        noBorder={noBorder}
        runAnimation={runAnimation}
        loaded={isLoaded}
      >
        <div className={requestHeaderClassNames}>
          <CardHeader
            data-test-id="requestCount"
            count={sortedRequests.length}
            title={'Online Requests'}
          >
          </CardHeader>
        </div>
        <div className={styles.requestBody}>
          {isLoaded ? display : null}
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
