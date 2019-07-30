
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sortAsc, dateFormatter } from '@carecru/isomorphic';
import RevenueDisplay from './RevenueDisplay';
import RevenueChart from './RevenueChart';
import AccountModel from '../../../entities/models/Account';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { Card } from '../../library';
import styles from './styles.scss';

const filterBooked = (startOfCurrentDay, endOfCurrentDay) => key =>
  key !== 'average' && (key < endOfCurrentDay || key === startOfCurrentDay);

const filterEstimated = endOfCurrentDay => key => key !== 'average' && key >= endOfCurrentDay;

const filterStartOfDay = startOfCurrentDay => key => key !== 'average' && key !== startOfCurrentDay;

function getFutureOrCurrentDayPosition(dataKeys, startOfCurrentDay, endOfCurrentDay) {
  const filteredData = dataKeys.filter(filterEstimated(endOfCurrentDay)).sort(sortAsc);

  return filteredData.length
    ? dataKeys
      .filter(filterStartOfDay(startOfCurrentDay))
      .sort(sortAsc)
      .indexOf(filteredData[0])
    : -1;
}

function generateDataPointsBeforeToday(data, dataKeys, startOfCurrentDay, endOfCurrentDay) {
  return dataKeys
    .filter(filterBooked(startOfCurrentDay, endOfCurrentDay))
    .sort(sortAsc)
    .map(key => Math.floor(data[key]));
}

function generateDataPointsAfterToday(data, dataKeys, endOfCurrentDay) {
  return dataKeys
    .filter(filterEstimated(endOfCurrentDay))
    .sort(sortAsc)
    .map(key => Math.floor(data[key]));
}

function generateLabels(dataKeys, timezone, startOfCurrentDay) {
  return dataKeys
    .filter(filterStartOfDay(startOfCurrentDay))
    .sort(sortAsc)
    .map(key => [dateFormatter(key, timezone, 'ddd'), dateFormatter(key, timezone, 'DD')]);
}

function renderDisplay(revenueData, account) {
  const revenue = revenueData.toJS();
  const isValid = revenue.average;

  const timezone = account.get('timezone');

  const currentDay = moment().tz(timezone);
  const startOfCurrentDay = currentDay.startOf('day').toISOString();
  const endOfCurrentDay = currentDay.endOf('day').toISOString();

  const dataKeys = Object.keys(revenue);
  const sortedDates = dataKeys.filter(filterStartOfDay(startOfCurrentDay)).sort(sortAsc);

  const billedData = generateDataPointsBeforeToday(
    revenue,
    dataKeys,
    startOfCurrentDay,
    endOfCurrentDay,
  );
  const estimatedData = generateDataPointsAfterToday(revenue, dataKeys, endOfCurrentDay);

  return (
    <RevenueDisplay
      dates={sortedDates}
      billedData={billedData}
      isValid={isValid}
      estimatedData={estimatedData}
      average={revenue.average}
      timezone={timezone}
    />
  );
}

function renderChart(revenueData, account) {
  const revenue = revenueData.toJS();
  const timezone = account.get('timezone');
  const isValid = revenue.average;

  const currentDay = moment().tz(timezone);
  const endOfCurrentDay = currentDay.endOf('day').toISOString();
  const startOfCurrentDay = currentDay.startOf('day').toISOString();

  const dataKeys = Object.keys(revenue);

  const labels = isValid ? generateLabels(dataKeys, timezone, startOfCurrentDay) : [];
  const billedData = isValid
    ? generateDataPointsBeforeToday(revenue, dataKeys, startOfCurrentDay, endOfCurrentDay)
    : [];
  const estimatedData = isValid
    ? generateDataPointsAfterToday(revenue, dataKeys, endOfCurrentDay)
    : [];

  const dayPos = getFutureOrCurrentDayPosition(dataKeys, startOfCurrentDay, endOfCurrentDay);

  const nullArray = Array(dayPos > -1 ? dayPos : 0).fill(null);

  return (
    <RevenueChart
      labels={labels}
      billedData={[...billedData, ...nullArray]}
      estimatedData={[...nullArray, ...estimatedData]}
      isValid={isValid}
    />
  );
}

class RevenueContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 20 * 1000,
      timer: null,
    };

    this.fetchRevenueData = this.fetchRevenueData.bind(this);
    this.refetchRevenueData = this.refetchRevenueData.bind(this);
  }

  componentDidMount() {
    const timer = setInterval(this.refetchRevenueData, this.state.timeout);

    this.setState({ timer });
    this.fetchRevenueData(this.props.dashboardDate);
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);
    const nextDate = moment(nextProps.dashboardDate);

    if (currentDate.toISOString() !== nextDate.toISOString()) {
      this.fetchRevenueData(nextProps.dashboardDate);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  fetchRevenueData(date, shouldCreateRequest = true) {
    const query = {
      date,
      pastDaysLimit: 30,
      maxDates: 12,
    };

    this.props.fetchEntitiesRequest({
      id: 'revenueFetch',
      url: '/api/revenue/totalRevenueDays',
      params: query,
      shouldCreateRequest,
    });
  }

  refetchRevenueData() {
    return this.fetchRevenueData(this.props.dashboardDate, false);
  }

  render() {
    const { revenueData, wasRevenueFetched, wasAccountFetched, account } = this.props;

    const wasAllFetched = wasRevenueFetched && wasAccountFetched;
    return (
      <Card
        className={styles.revenueContainer}
        runAnimation
        loaded={wasAllFetched}
        loaderStyle={styles.loader}
      >
        {wasAllFetched && renderDisplay(revenueData.get('data'), account)}
        {wasAllFetched && renderChart(revenueData.get('data'), account)}
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchEntitiesRequest }, dispatch);
}

function mapStateToProps({ apiRequests, entities, auth }) {
  const revenueData = apiRequests.get('revenueFetch') && apiRequests.get('revenueFetch').data;
  const wasAccountFetched =
    apiRequests.get('dashAccount') && apiRequests.get('dashAccount').wasFetched;
  const wasRevenueFetched =
    apiRequests.get('revenueFetch') && apiRequests.get('revenueFetch').wasFetched;

  return {
    timezone: auth.get('timezone'),
    revenueData,
    wasRevenueFetched,
    wasAccountFetched,
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

RevenueContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func.isRequired,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  revenueData: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Map)]),
  account: PropTypes.instanceOf(AccountModel),
  wasRevenueFetched: PropTypes.bool,
  wasAccountFetched: PropTypes.bool,
};

RevenueContainer.defaultProps = {
  wasRevenueFetched: false,
  wasAccountFetched: false,
  revenueData: new Map(),
  account: new Map(),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RevenueContainer);
