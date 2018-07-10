
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RevenueDisplay from './RevenueDisplay';
import RevenueChart from './RevenueChart';
import AccountModel from '../../../entities/models/Account';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { Card } from '../../library';
import sortAsc from '../../../../iso/helpers/sort/sortAsc';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import styles from './styles.scss';

function generateLabels(data, timezone) {
  const dateKeys = Object.keys(data);
  return dateKeys
    .filter(key => key !== 'average')
    .sort(sortAsc)
    .map(key => [dateFormatter(key, timezone, 'ddd'), dateFormatter(key, timezone, 'DD')]);
}

function generateDataPoints(data) {
  const dateKeys = Object.keys(data);
  return dateKeys
    .filter(key => key !== 'average')
    .sort(sortAsc)
    .map(key => Math.floor(data[key]));
}

function renderDisplay(revenueData) {
  const revenue = revenueData.toJS();
  const isValid = revenue.average;
  const data = generateDataPoints(revenue);

  return <RevenueDisplay data={data} isValid={isValid} average={revenue.average} />;
}

function renderChart(revenueData, account) {
  const revenue = revenueData.toJS();

  const isValid = revenue.average;

  const labels = isValid ? generateLabels(revenue, account.get('timezone')) : [];
  const data = isValid ? generateDataPoints(revenue) : [];

  return <RevenueChart labels={labels} data={data} isValid={isValid} />;
}

class RevenueContainer extends Component {
  componentDidMount() {
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
    const {
      revenueData, wasRevenueFetched, wasAccountFetched, account,
    } = this.props;

    const wasAllFetched = wasRevenueFetched && wasAccountFetched;
    return (
      <Card
        className={styles.revenueContainer}
        runAnimation
        loaded={wasAllFetched}
        loaderStyle={styles.loader}
      >
        {wasAllFetched && renderDisplay(revenueData.get('data'))}
        {wasAllFetched && renderChart(revenueData.get('data'), account)}
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
    },
    dispatch,
  );
}

function mapStateToProps({ apiRequests, entities, auth }) {
  const revenueData = apiRequests.get('revenueFetch') && apiRequests.get('revenueFetch').data;
  const wasAccountFetched =
    apiRequests.get('dashAccount') && apiRequests.get('dashAccount').wasFetched;
  const wasRevenueFetched =
    apiRequests.get('revenueFetch') && apiRequests.get('revenueFetch').wasFetched;

  return {
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
