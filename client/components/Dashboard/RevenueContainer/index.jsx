
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RevenueDisplay from './RevenueDisplay';
import RevenueChart from './RevenueChart';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { Card } from '../../library';
import styles from './styles.scss';

export const sortByDate = (a, b) => {
  if (moment(a).isBefore(moment(b))) return -1;
  if (moment(a).isAfter(moment(b))) return 1;
  return 0;
};

function generateLabels(data) {
  const dateKeys = Object.keys(data);
  return dateKeys
    .filter(key => key !== 'average')
    .sort(sortByDate)
    .map(key => [moment(key).format('ddd'), moment(key).format('DD')]);
}

function getCurrentDate(data) {
  const dateKeys = Object.keys(data);
  return dateKeys.filter(key => key !== 'average').sort(sortByDate)[dateKeys.length - 2];
}

function generateDataPoints(data) {
  const dateKeys = Object.keys(data);
  return dateKeys
    .filter(key => key !== 'average')
    .sort(sortByDate)
    .map(key => Math.floor(data[key]));
}

function renderDisplay(revenueData) {
  const revenue = revenueData.toJS();
  const isValid = revenue.average;
  const data = generateDataPoints(revenue);
  const firstDate = getCurrentDate(revenue);

  return (
    <RevenueDisplay firstDate={firstDate} data={data} isValid={isValid} average={revenue.average} />
  );
}

function renderChart(revenueData) {
  const revenue = revenueData.toJS();

  const isValid = revenue.average;

  const labels = isValid ? generateLabels(revenue) : [];
  const data = isValid ? generateDataPoints(revenue) : [];

  return <RevenueChart labels={labels} data={data} isValid={isValid} />;
}

class RevenueContainer extends Component {
  componentWillMount() {
    const { dashboardDate } = this.props;

    const query = {
      date: dashboardDate,
      pastDaysLimit: 30,
      maxDates: 12,
    };

    this.props.fetchEntitiesRequest({
      id: 'revenueFetch',
      url: '/api/revenue/totalRevenueDays',
      params: query,
    });
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);
    const nextDate = moment(nextProps.dashboardDate);

    if (currentDate.toISOString() !== nextDate.toISOString()) {
      const query = {
        date: nextProps.dashboardDate,
        pastDaysLimit: 30,
        maxDates: 12,
      };

      this.props.fetchEntitiesRequest({
        id: 'revenueFetch',
        url: '/api/revenue/totalRevenueDays',
        params: query,
      });
    }
  }

  render() {
    const { revenueData, wasRevenueFetched } = this.props;

    return (
      <Card
        className={styles.revenueContainer}
        runAnimation
        loaded={wasRevenueFetched}
        loaderStyle={styles.loader}
      >
        {wasRevenueFetched && renderDisplay(revenueData.get('data'))}
        {wasRevenueFetched && renderChart(revenueData.get('data'))}
      </Card>
    );
  }
}

RevenueContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func.isRequired,
  dashboardDate: PropTypes.instanceOf(Date),
  revenueData: PropTypes.instanceOf(Object),
  wasRevenueFetched: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
    },
    dispatch
  );
}

function mapStateToProps({ apiRequests }) {
  const revenueData = apiRequests.get('revenueFetch') ? apiRequests.get('revenueFetch').data : null;
  const wasRevenueFetched = apiRequests.get('revenueFetch')
    ? apiRequests.get('revenueFetch').wasFetched
    : null;

  return {
    revenueData,
    wasRevenueFetched,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RevenueContainer);

