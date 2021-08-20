import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Record } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CallsBody from './CallsBody';
import {
  fetchEntitiesRequest,
  fetchEntities,
  updateEntityRequest,
} from '../../thunks/fetchEntities';
import { deleteAllEntity } from '../../reducers/entities';
import { getUTCDate, getTodaysDate } from '../library';

const paramBuilder = (startDate, endDate, accountId, skip, limit) => ({
  startDate: startDate.toDate(),
  endDate: endDate.toDate(),
  accountId,
  skip,
  limit,
});

class Calls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endDate: getTodaysDate(props.timezone).endOf('day'),
      startDate: getTodaysDate(props.timezone).subtract(1, 'months'),
      skip: 0,
      limit: 25,
      moreData: false,
      callsLength: 0,
      accountId: null,
      fetchingCalls: false,
    };
    this.loadMore = this.loadMore.bind(this);
    this.handleDateRange = this.handleDateRange.bind(this);
    this.fetchCallData = this.fetchCallData.bind(this);
    this.handleCallUpdate = this.handleCallUpdate.bind(this);
  }

  componentDidMount() {
    const { startDate, endDate, skip, limit } = this.state;
    const params = paramBuilder(startDate, endDate, this.props.accountId, skip, limit);

    this.fetchCallData(params).then((data) => {
      const dataLength = Object.keys(data[1].calls || {}).length;
      const moreData = dataLength === this.state.limit;
      this.setState((prevState) => ({
        skip: prevState.skip + dataLength,
        moreData,
        callsLength: dataLength,
        accountId: this.props.accountId,
      }));
    });
  }

  componentWillUnmount() {
    this.props.deleteAllEntity('calls');
  }

  handleDateRange(values) {
    const { timezone } = this.props;
    const startDate = getUTCDate(values.from, timezone);
    const endDate = getUTCDate(values.to, timezone);

    if (
      startDate.isValid() &&
      endDate.isValid() &&
      startDate.toISOString() !== endDate.toISOString()
    ) {
      this.props.deleteAllEntity('calls');

      const { limit, accountId } = this.state;

      const params = paramBuilder(startDate, endDate, accountId, 0, limit);

      this.fetchCallData(params).then((data) => {
        const dataLength = Object.keys(data[1].calls).length;
        const moreData = dataLength === limit;
        this.setState({
          moreData,
          skip: limit,
          callsLength: dataLength,
          startDate,
          endDate,
        });
      });
    }
  }

  handleCallUpdate(id, wasApptBooked) {
    this.props.updateEntityRequest({
      key: 'calls',
      values: { wasApptBooked },
      url: `/api/calls/${id}`,
    });
  }

  fetchCallData(params) {
    return Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'callGraphStats',
        url: '/api/calls/statsgraph',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'calls',
        url: '/api/calls',
        join: ['patient'],
        params,
      }),
    ]);
  }

  loadMore() {
    const { startDate, endDate, accountId, skip, limit, callsLength } = this.state;
    const params = paramBuilder(startDate, endDate, accountId, skip, limit);

    this.setState({ fetchingCalls: true });
    this.props
      .fetchEntities({
        id: 'calls',
        url: '/api/calls',
        join: ['patient'],
        params,
      })
      .then((data) => {
        const dataLength = Object.keys(data.calls || {}).length;
        const moreData = dataLength === limit;
        this.setState({
          skip: skip + limit,
          moreData,
          callsLength: callsLength + dataLength,
          fetchingCalls: false,
        });
      });
  }

  render() {
    const { callGraphStats, calls, patients, wasCallsFetched, wasStatsFetched } = this.props;
    return (
      <CallsBody
        calls={calls}
        callGraphStats={callGraphStats}
        patients={patients}
        handleDateRange={this.handleDateRange}
        loadMore={this.loadMore}
        moreData={this.state.moreData}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        wasCallsFetched={wasCallsFetched}
        wasStatsFetched={wasStatsFetched}
        callsLength={this.state.callsLength}
        handleCallUpdate={this.handleCallUpdate}
        fetchingCalls={this.state.fetchingCalls}
      />
    );
  }
}

function mapStateToProps({ entities, apiRequests, auth }) {
  const callGraphStats = apiRequests.get('callGraphStats') || null;
  const wasStatsFetched =
    (apiRequests.get('callGraphStats') && apiRequests.get('callGraphStats').wasFetched) || null;

  const wasCallsFetched = (apiRequests.get('calls') && apiRequests.get('calls').wasFetched) || null;

  return {
    callGraphStats,
    calls: entities.getIn(['calls', 'models']),
    patients: entities.getIn(['patients', 'models']),
    wasCallsFetched,
    wasStatsFetched,
    timezone: auth.get('timezone'),
    accountId: auth.get('accountId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      updateEntityRequest,
      fetchEntities,
      deleteAllEntity,
    },
    dispatch,
  );
}

Calls.propTypes = {
  callGraphStats: PropTypes.instanceOf(Record),
  patients: PropTypes.instanceOf(Map),
  calls: PropTypes.instanceOf(Map),
  fetchEntitiesRequest: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
  wasCallsFetched: PropTypes.bool,
  wasStatsFetched: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
  accountId: PropTypes.string.isRequired,
};

Calls.defaultProps = {
  wasCallsFetched: false,
  wasStatsFetched: false,
  calls: null,
  patients: null,
  callGraphStats: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calls);
