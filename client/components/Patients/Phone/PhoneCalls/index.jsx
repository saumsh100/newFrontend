import React, { PropTypes } from 'react';
import moment from 'moment';
import { Card, CardHeader, InfiniteScroll } from '../../../library';
import styles from './styles.scss';
import CallList from './CallList';

function PhoneCalls(props) {
  const {
    calls,
    patients,
    startDate,
    endDate,
    callGraphStats,
  } = props;

  let title = (<div>
    <span className={styles.grey}>Calls From </span>
    <span>{`${startDate.format('MMMM Do YYYY')} to ${endDate.format('MMMM Do YYYY')}`}</span>
  </div>);

  if (callGraphStats && callGraphStats.toJS().data.yValues) {
    const val = callGraphStats.toJS().data.yValues.reduce((a, b) => a + b, 0);
    title = (<div>
      <span className={styles.grey}>{val} Calls From </span>
      <span>{`${startDate.format('MMMM Do YYYY')} to ${endDate.format('MMMM Do YYYY')}`}</span>
    </div>);
  }

  const displayCalls = calls.map((call) => {
    const callJS = call.toJS();
    const callerName = callJS.patientId ? `${patients.get(callJS.patientId).firstName} ${patients.get(callJS.patientId).lastName}`
    : callJS.callerName;

    return (<CallList
      key={callJS.id}
      id={callJS.id}
      callSource={callJS.callSource}
      startTime={callJS.startTime}
      callerNum={callJS.callerNum}
      callerCity={callJS.callerCity}
      callerName={callerName}
      duration={callJS.duration}
      answered={callJS.answered}
      wasApptBooked={!!callJS.wasApptBooked}
      recording={callJS.recording}
    />);
  });

  return (
    <Card className={styles.booked} >
      <div className={styles.booked__header}>
        <CardHeader title={title} />
      </div>
      <div className={styles.infinite}>
        <table className={styles.table} cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th className={styles.columnHead}>Source Name</th>
              <th className={styles.columnHead}>Start Time</th>
              <th className={styles.columnHead}>Name</th>
              <th className={styles.columnHead}>Phone Number</th>
              <th className={styles.columnHead}>City</th>
              <th className={styles.columnHead}>Duration</th>
              <th className={styles.columnHead}>Appointment Booked</th>
            </tr>
          </thead>
          <tbody className={styles.scroll}>
            <InfiniteScroll
              loadMore={props.loadMore}
              loader={<div style={{ clear: 'both' }}>Loading...</div>}
              hasMore={props.moreData}
              initialLoad={false}
              useWindow={false}
              threshold={1}
            >
              {displayCalls}
            </InfiniteScroll>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

PhoneCalls.propTypes = {
  calls: PropTypes.object,
  patients: PropTypes.object,
  moreData: PropTypes.boolean,
  loadMore: PropTypes.function,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  callGraphStats: PropTypes.object,
};

export default PhoneCalls;
