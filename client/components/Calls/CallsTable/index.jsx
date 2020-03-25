
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import moment from 'moment';
import { Map, Record } from 'immutable';
import { InfiniteScroll } from '../../library';
import CallListItem from './CallListItem';
import styles from './styles.scss';

class CallsTable extends Component {
  componentDidMount() {
    const { callGraphStats } = this.props;

    const yData = callGraphStats.toJS().data.yValues;
    this.yDataCount = yData.filter(y => y !== 0).reduce((a, b) => a + b, 0);
  }

  render() {
    const { calls, patients, callsLength, openCallModal } = this.props;

    const sortedCalls = calls
      .toArray()
      .sort((a, b) => moment(b.startTime).diff(a.startTime))
      .filter((call, index) => index < callsLength);

    const renderHeaderColumns = () => (
      <div className={styles.rowHeader}>
        <div className={styles.colSmall}>#</div>
        <div className={styles.col}>Source Name</div>
        <div className={styles.col}>Caller</div>
        <div className={styles.col}>Start Time</div>
        <div className={styles.col}>Duration</div>
        <div className={styles.col}>City</div>
        <div className={styles.col}>Call Details</div>
        <div className={styles.colEmpty} />
      </div>
    );

    const displayCalls = sortedCalls.map((call, index) => {
      const callJS = call.toJS();
      const patient = callJS.patientId ? patients.get(callJS.patientId) : null;
      const callerName = callJS.patientId
        ? `${patients.get(callJS.patientId).firstName} ${patients.get(callJS.patientId).lastName}`
        : callJS.callerName;

      callJS.callerName = callerName;

      return (
        <div
          className={styles.callListItem}
          onClick={() => openCallModal(callJS)}
          key={`callContainer_${callJS.id}`}
          role="button"
          tabIndex={index}
          onKeyDown={e => e.keyCode === 13 && openCallModal(callJS)}
        >
          <CallListItem
            key={callJS.id}
            id={callJS.id}
            index={index}
            callSource={callJS.callSource}
            startTime={callJS.startTime}
            callerNum={callJS.callerNum}
            callerCity={callJS.callerCity}
            callerName={callerName}
            duration={callJS.duration}
            answered={callJS.answered}
            recording={callJS.recording}
            patient={patient}
          />
        </div>
      );
    });

    return (
      <div className={styles.callTableContainer}>
        <div className={styles.header}>
          <div className={styles.title}> {this.yDataCount} Calls </div>
          {renderHeaderColumns()}
        </div>
        <div className={styles.callTableBody}>
          <InfiniteScroll
            loadMore={this.props.loadMore}
            hasMore={this.props.moreData || callsLength !== sortedCalls.length}
            initialLoad={false}
            useWindow={false}
            threshold={1}
          >
            {displayCalls}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

CallsTable.propTypes = {
  calls: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  moreData: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  callGraphStats: PropTypes.instanceOf(Record),
  callsLength: PropTypes.number,
  openCallModal: PropTypes.func.isRequired,
};

CallsTable.defaultProps = {
  calls: new Map(),
  patients: new Map(),
  moreData: false,
  callsLength: 0,
  callGraphStats: new Record(),
};

export default CallsTable;
