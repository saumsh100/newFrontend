
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Map, Record } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwt from 'jwt-decode';
import CallsBody from './CallsBody';
import {
  fetchEntitiesRequest,
  fetchEntities,
  updateEntityRequest,
} from '../../thunks/fetchEntities';
import { deleteAllEntity } from '../../actions/entities';

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
      endDate: moment().endOf('day'),
      startDate: moment().subtract(1, 'months'),
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
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);

    const {
      startDate, endDate, skip, limit,
    } = this.state;

    const params = paramBuilder(startDate, endDate, decodedToken.activeAccountId, skip, limit);

    this.fetchCallData(params).then((data) => {
      const dataLength = Object.keys(data[1].calls || {}).length;
      const moreData = dataLength === this.state.limit;
      this.setState({
        skip: this.state.skip + dataLength,
        moreData,
        callsLength: dataLength,
        accountId: decodedToken.activeAccountId,
      });
    });
  }

  componentWillUnmount() {
    this.props.deleteAllEntity('calls');
  }

  handleDateRange(values) {
    this.props.deleteAllEntity('calls');

    const { limit, accountId } = this.state;

    const startDate = moment(values.from);
    const endDate = moment(values.to);

    this.setState({
      startDate,
      endDate,
    });

    const params = paramBuilder(startDate, endDate, accountId, 0, limit);

    this.fetchCallData(params).then((data) => {
      const dataLength = Object.keys(data[1].calls).length;
      const moreData = dataLength === limit;
      this.setState({
        moreData,
        skip: limit,
        callsLength: dataLength,
      });
    });
  }

  loadMore() {
    const {
      startDate, endDate, accountId, skip, limit, callsLength,
    } = this.state;

    const params = paramBuilder(startDate, endDate, accountId, skip, limit);

    this.setState({
      fetchingCalls: true,
    });

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

  handleCallUpdate(id, wasApptBooked) {
    this.props.updateEntityRequest({
      key: 'calls',
      values: { wasApptBooked },
      url: `/api/calls/${id}`,
    });
  }

  render() {
    const {
      callGraphStats, calls, patients, wasCallsFetched, wasStatsFetched,
    } = this.props;

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

function mapStateToProps({ entities, apiRequests }) {
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
};

Calls.defaultProps = {
  wasCallsFetched: false,
  wasStatsFetched: false,
  calls: null,
  patients: null,
  callGraphStats: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calls);
