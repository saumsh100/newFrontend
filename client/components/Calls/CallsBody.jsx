import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, Record } from 'immutable';
import CallsGraph from './CallsGraph';
import CallsTable from './CallsTable';
import CallInfo from './CallInfo';
import { Card, DayPickerRange, DialogBox, DateTimeObj } from '../library';
import styles from './styles.scss';

function adjustTableHeight(callSize, containerHeight) {
  if (callSize >= 25 && containerHeight > 700) {
    return {
      maxHeight: `${containerHeight + 30}px`,
      marginBottom: '15px',
    };
  }
  if (callSize > 0 && callSize <= 5) {
    return {
      flex: 1,
    };
  }
  if (callSize > 5) {
    return {
      marginBottom: '15px',
      flex: 1,
    };
  }
  return {};
}

class CallsBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCallModalOpen: false,
      selectedCall: null,
    };

    this.openCallModal = this.openCallModal.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  componentDidMount() {
    this.callsContainerHeight = document.getElementById('callsContainer').clientHeight;
  }

  openCallModal(selectedCall) {
    this.setState({
      selectedCall,
      isCallModalOpen: true,
    });
  }

  reinitializeState() {
    this.setState({
      selectedCall: null,
      isCallModalOpen: false,
    });
  }

  render() {
    const {
      callGraphStats,
      startDate,
      endDate,
      handleDateRange,
      wasStatsFetched,
      wasCallsFetched,
      moreData,
      loadMore,
      patients,
      calls,
      callsLength,
      handleCallUpdate,
      fetchingCalls,
      timezone,
    } = this.props;

    const wasAllFetched = wasStatsFetched && wasCallsFetched;

    let cardTableStyle = styles.cardTable;
    const cardTableInlineStyle = wasAllFetched
      ? adjustTableHeight(calls.size, this.callsContainerHeight)
      : {};

    if (!wasCallsFetched || !calls.size) {
      cardTableStyle = styles.emptyTable;
    }

    return (
      <div className={styles.callsContainer} id="callsContainer">
        <div className={styles.cardGraph}>
          <div className={styles.headerGraph}>
            <Card className={styles.headerGraph_title}>Calls</Card>
          </div>
          {wasStatsFetched && (
            <Card runAnimation loaded={wasStatsFetched}>
              <div className={styles.graphDateInfo}>
                <div className={styles.subHeader}>
                  {startDate.format('MMMM DD, YYYY')} - {endDate.format('MMMM DD, YYYY')}
                </div>
                <DayPickerRange
                  popover
                  disabledDays={{ after: new Date() }}
                  from={startDate.toDate()}
                  to={endDate.toDate()}
                  onChange={handleDateRange}
                  monthsToShow={2}
                  maxDays={60}
                  timezone={timezone}
                  withShadow
                />
              </div>
              <CallsGraph callGraphStats={callGraphStats} startDate={startDate} endDate={endDate} />
            </Card>
          )}
        </div>
        <Card
          runAnimation
          loaded={wasAllFetched && !fetchingCalls}
          className={cardTableStyle}
          style={cardTableInlineStyle}
        >
          {wasAllFetched && (
            <CallsTable
              calls={calls}
              callGraphStats={callGraphStats}
              patients={patients}
              loadMore={loadMore}
              moreData={moreData}
              startDate={startDate}
              endDate={endDate}
              wasCallsFetched={wasCallsFetched}
              wasStatsFetched={wasStatsFetched}
              callsLength={callsLength}
              openCallModal={this.openCallModal}
            />
          )}
          {wasAllFetched && (
            <DialogBox
              title="Call Details"
              active={this.state.isCallModalOpen}
              onEscKeyDown={this.reinitializeState}
              onOverlayClick={this.reinitializeState}
              custom
            >
              {this.state.selectedCall && (
                <CallInfo
                  call={this.state.selectedCall}
                  handleCallUpdate={handleCallUpdate}
                  timezone={timezone}
                />
              )}
            </DialogBox>
          )}
        </Card>
      </div>
    );
  }
}

CallsBody.propTypes = {
  callGraphStats: PropTypes.instanceOf(Record),
  startDate: PropTypes.instanceOf(DateTimeObj),
  endDate: PropTypes.instanceOf(DateTimeObj),
  handleDateRange: PropTypes.func,
  wasStatsFetched: PropTypes.bool,
  wasCallsFetched: PropTypes.bool,
  moreData: PropTypes.bool,
  loadMore: PropTypes.func,
  patients: PropTypes.instanceOf(Map),
  calls: PropTypes.instanceOf(Map),
  callsLength: PropTypes.number,
  handleCallUpdate: PropTypes.func.isRequired,
  fetchingCalls: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

CallsBody.defaultProps = {
  callGraphStats: null,
  startDate: null,
  endDate: null,
  handleDateRange: null,
  wasStatsFetched: null,
  wasCallsFetched: null,
  moreData: null,
  loadMore: null,
  patients: null,
  calls: null,
  callsLength: null,
  fetchingCalls: null,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(CallsBody);
