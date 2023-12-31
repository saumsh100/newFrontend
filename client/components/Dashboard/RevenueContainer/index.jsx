import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sortAsc } from '../../../util/isomorphic';
import RevenueDisplay from './RevenueDisplay';
import RevenueChart from './RevenueChart';
import AccountModel from '../../../entities/models/Account';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { Card, getTodaysDate, getISODate, getFormattedDate } from '../../library';

import styles from '../styles';

const filterBooked = (startOfCurrentDay, endOfCurrentDay) => (key) =>
  key !== 'average' && (key < endOfCurrentDay || key === startOfCurrentDay);

const filterEstimated = (endOfCurrentDay) => (key) => key !== 'average' && key >= endOfCurrentDay;

const filterStartOfDay = (startOfCurrentDay) => (key) =>
  key !== 'average' && key !== startOfCurrentDay;

function getFutureOrCurrentDayPosition(dataKeys, startOfCurrentDay, endOfCurrentDay) {
  const filteredData = dataKeys.filter(filterEstimated(endOfCurrentDay)).sort(sortAsc);

  return filteredData.length
    ? dataKeys.filter(filterStartOfDay(startOfCurrentDay)).sort(sortAsc).indexOf(filteredData[0])
    : -1;
}

function generateDataPointsBeforeToday(data, dataKeys, startOfCurrentDay, endOfCurrentDay) {
  return dataKeys
    .filter(filterBooked(startOfCurrentDay, endOfCurrentDay))
    .sort(sortAsc)
    .map((key) => Math.floor(data[key]));
}

function generateDataPointsAfterToday(data, dataKeys, endOfCurrentDay) {
  return dataKeys
    .filter(filterEstimated(endOfCurrentDay))
    .sort(sortAsc)
    .map((key) => Math.floor(data[key]));
}

function generateLabels(dataKeys, timezone, startOfCurrentDay) {
  return dataKeys
    .filter(filterStartOfDay(startOfCurrentDay))
    .sort(sortAsc)
    .map((key) => [getFormattedDate(key, 'ddd', timezone), getFormattedDate(key, 'DD', timezone)]);
}

function renderDisplay(revenueData, account, dashboardDate) {
  const revenue = revenueData.toJS();
  const isValid = revenue.average;

  const timezone = account.get('timezone');

  const currentDay = getTodaysDate(timezone);
  const startOfCurrentDay = currentDay.startOf('day').toISOString();
  const endOfCurrentDay = currentDay.endOf('day').toISOString();

  const dataKeys = Object.keys(revenue);

  const billedData = generateDataPointsBeforeToday(
    revenue,
    dataKeys,
    startOfCurrentDay,
    endOfCurrentDay,
  );
  const estimatedData = generateDataPointsAfterToday(revenue, dataKeys, endOfCurrentDay);
  return (
    <RevenueDisplay
      billedData={billedData}
      isValid={isValid}
      estimatedData={estimatedData}
      average={revenue.average}
      timezone={timezone}
      dashboardDate={dashboardDate}
    />
  );
}

function renderChart(revenueData, account) {
  const revenue = revenueData.toJS();
  const timezone = account.get('timezone');
  const isValid = revenue.average;

  const currentDay = getTodaysDate(timezone);
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

    const pollInterval = Number(process.env.POLLING_REVENUE_INTERVAL || '20');
    this.state = {
      timeout: pollInterval * 1000,
    };

    this.fetchRevenueData = this.fetchRevenueData.bind(this);
    this.refetchRevenueData = this.refetchRevenueData.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(this.refetchRevenueData, this.state.timeout);
    this.fetchRevenueData(this.props.dashboardDate);
  }

  componentDidUpdate(prevProps) {
    const currentDate = getISODate(this.props.dashboardDate);
    const previousDate = getISODate(prevProps.dashboardDate);

    if (currentDate !== previousDate) {
      this.fetchRevenueData(this.props.dashboardDate);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
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
    const { revenueData, wasRevenueFetched, wasAccountFetched, account, dashboardDate } =
      this.props;

    const wasAllFetched = wasRevenueFetched && wasAccountFetched;
    return (
      <Card
        className={styles.revenueContainer_revenueContainer}
        runAnimation
        loaded={wasAllFetched}
        loaderStyle={styles.revenueContainer_loader}
      >
        {wasAllFetched && renderDisplay(revenueData.get('data'), account, dashboardDate)}
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

export default connect(mapStateToProps, mapDispatchToProps)(RevenueContainer);
