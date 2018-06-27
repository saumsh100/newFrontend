
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwt from 'jwt-decode';
import { Map } from 'immutable';
import DocumentTitle from 'react-document-title';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import styles from './styles.scss';
import HeaderUserDate from './HeaderUserDate/index';
import StatsContainer from './StatsContainer';
import AppsRequestsContainer from './AppsRequestsContainer/index';
import PatientInsightsContainer from './PatientInsightsContainer/index';
import DonnaToDoListContainer from './DonnaToDoListContainer/index';
import { setDashboardDate } from '../../reducers/dashboard';
import RevenueContainer from './RevenueContainer';
import { fetchDonnasToDos } from '../../thunks/dashboard';
import FeatureFlagWrapper from '../FeatureFlagWrapper';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchEntitiesRequest({ key: 'users' });
    this.props.fetchEntitiesRequest({
      id: 'dashAccount',
      key: 'accounts',
    });
  }

  render() {
    const { users } = this.props;
    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const user = users.get(decodedToken.userId);
    const userName = user ? user.get('firstName') : '';

    return (
      <DocumentTitle title="CareCru | Dashboard">
        <div className={styles.dashboard}>
          <HeaderUserDate
            user={userName}
            dashboardDate={this.props.dashboardDate}
            setDashboardDate={this.props.setDashboardDate}
          />

          <div className={styles.revenueColFlex}>
            <FeatureFlagWrapper featureKey="feature-revenue-card">
              <RevenueContainer dashboardDate={this.props.dashboardDate} />
            </FeatureFlagWrapper>

            <StatsContainer dashboardDate={this.props.dashboardDate} />
          </div>

          <div className={styles.colFlex}>
            <AppsRequestsContainer dashboardDate={this.props.dashboardDate} />

            <PatientInsightsContainer
              dashboardDate={this.props.dashboardDate}
            />
          </div>

          <DonnaToDoListContainer
            fetchDonnasToDos={this.props.fetchDonnasToDos}
            dashboard={this.props.dashboard}
          />
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps({ entities, dashboard }) {
  return {
    users: entities.getIn(['users', 'models']),
    dashboardDate: dashboard.toJS().dashboardDate,
    dashboard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      fetchDonnasToDos,
      setDashboardDate,
    },
    dispatch,
  );
}

Dashboard.propTypes = {
  users: PropTypes.instanceOf(Map).isRequired,
  dashboardDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]).isRequired,
  setDashboardDate: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  fetchDonnasToDos: PropTypes.func.isRequired,
  dashboard: PropTypes.shape({
    dashboardDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
    loadingInsights: PropTypes.bool,
    loadingToDos: PropTypes.bool,
    insightCount: PropTypes.number,
    insights: PropTypes.arrayOf(PropTypes.any),
    reminders: PropTypes.arrayOf(PropTypes.any),
    reviews: PropTypes.arrayOf(PropTypes.any),
    recalls: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);
