import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import classNames from 'classnames';
import { isHub } from '../../util/hub';
import RequestList from './RequestList';
import RequestsModel from '../../entities/models/Request';
import { Card, CardHeader } from '../library';
import styles from '../Dashboard/styles';

const Requests = (props) => {
  const {
    filteredRequests,
    sortedRequests,
    requestId,
    selectedRequest,
    services,
    patientUsers,
    practitioners,
    popoverRight,
    noBorder,
    disableHeader,
    runAnimation,
    isLoaded,
    redirect,
  } = props;

  let requestHeaderClassNames = styles.requestHeader;
  if (disableHeader) {
    requestHeaderClassNames = classNames(requestHeaderClassNames, styles.hidden);
  }

  let display = (
    <RequestList
      sortedRequests={sortedRequests}
      requestId={requestId}
      selectedRequest={selectedRequest}
      services={services}
      patientUsers={patientUsers}
      practitioners={practitioners}
      popoverRight={popoverRight}
      redirect={redirect}
    />
  );

  if (filteredRequests && filteredRequests.length === 0) {
    display = <div className={styles.noRequests}>No Requests</div>;
  }
  return (
    <Card
      className={classNames(styles.requestCard, {
        [styles.requestCardMobile]: isHub(),
      })}
      noBorder={noBorder}
      runAnimation={runAnimation}
      loaded={isLoaded}
    >
      {!isHub() && (
        <div className={requestHeaderClassNames}>
          <CardHeader
            data-test-id="requestCount"
            count={sortedRequests.length || 0}
            title="Online Requests"
            requests
          />
        </div>
      )}
      <div className={styles.requestBody}>{isLoaded && display}</div>
    </Card>
  );
};

Requests.propTypes = {
  disableHeader: PropTypes.bool,
  isLoaded: PropTypes.bool,
  noBorder: PropTypes.bool,
  patientUsers: PropTypes.instanceOf(Map),
  popoverRight: PropTypes.string,
  practitioners: PropTypes.instanceOf(Map),
  redirect: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  requests: PropTypes.instanceOf(Map),
  filteredRequests: PropTypes.arrayOf(RequestsModel),
  sortedRequests: PropTypes.arrayOf(RequestsModel),
  requestId: PropTypes.string,
  selectedRequest: PropTypes.instanceOf(RequestsModel),
  runAnimation: PropTypes.bool,
  services: PropTypes.instanceOf(Map),
};

export default Requests;
