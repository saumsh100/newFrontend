import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isHub } from '../../util/hub';
import RequestList from './RequestList';
import CancellationList from './CancellationData/CancellationList';
import RequestsModel from '../../entities/models/Request';
import { Card, Tabs, Tab } from '../library';
import styles from '../Dashboard/styles';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import {cancellationListItem} from './CancellationData/thunks';
import { httpClient } from '../../util/httpClient';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

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
    tab,
    accountId,
  } = props;

  const [index, setIndex] = useState(0);
  const [cancellationList, setCancellationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cancellationListItem(accountId).then(({ data }) => {
      setLoading(false);
      setCancellationList(data);
    });
    const interval = setInterval(() => {
      cancellationListItem(accountId).then(({ data }) => {
        setLoading(false);
        setCancellationList(data);
      });
    }, 15 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const prevAmount = usePrevious({ sortedRequests });
  document.addEventListener('visibilitychange', () => {
    if (
      document.visibilityState === 'visible' &&
      prevAmount.sortedRequests.length !== sortedRequests.length
    ) {
      props.fetchEntitiesRequest({
        id: 'dashRequests',
        key: 'requests',
        join: ['service', 'patientUser', 'requestingPatientUser', 'practitioner'],
      });
    }
  });

  let requestHeaderClassNames = styles.requestHeader;
  if (disableHeader) {
    requestHeaderClassNames = classNames(requestHeaderClassNames, styles.hidden);
  }
  const displayApps = (
    <CancellationList
      cancellationList={cancellationList}
      setCancellationList={setCancellationList}
      setLoading={setLoading}
    />
  );
  let displayRequests = (
    <RequestList
      sortedRequests={sortedRequests}
      requestId={requestId}
      selectedRequest={selectedRequest}
      services={services}
      patientUsers={patientUsers}
      practitioners={practitioners}
      popoverRight={popoverRight}
      redirect={redirect}
      tab={tab}
    />
  );
 
  const isLoadeds = isLoaded === true ? !loading : isLoaded;
  

  if (filteredRequests && filteredRequests.length === 0) {
    displayRequests = <div className={styles.noRequests}>No Requests</div>;
  }
  const display = [displayRequests, displayApps][index];
  return (
    <Card
      className={classNames(styles.requestCard, {
        [styles.requestCardMobile]: isHub(),
      })}
      noBorder={noBorder}
      runAnimation={runAnimation}
      loaded={isLoadeds}
    >
      {!isHub() && (
        <div className={requestHeaderClassNames}>
          <Tabs index={index} onChange={(i) => setIndex(i)} noUnderLine>
            <Tab
              label={`${sortedRequests.length || 0} Online Requests`}
              className={styles.appRequestContainer_scheduleTab}
              activeClass={styles.appRequestContainer_activeTab}
            />
            <Tab
              label={`${cancellationList.length || 0} Appointments`}
              className={styles.appRequestContainer_scheduleTab}
              activeClass={styles.appRequestContainer_activeTab}
            />
          </Tabs>
        </div>
      )}
      <div className={styles.requestBody}> {display}</div>
    </Card>
  );
};
function mapStateToProps({ auth, schedule }) {
  return {
    timezone: auth.get('timezone'),
    role: auth.get('role'),
    accountId: auth.get('accountId'),
    timeFrame: schedule.get('timeFrame'),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
    },
    dispatch,
  );
}

Requests.propTypes = {
  disableHeader: PropTypes.bool,
  isLoaded: PropTypes.bool,
  noBorder: PropTypes.bool,
  patientUsers: PropTypes.instanceOf(Map),
  fetchEntitiesRequest: PropTypes.func.isRequired,
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
  tab: PropTypes.string.isRequired,
};
const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Requests);
