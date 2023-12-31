import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import DocumentTitle from 'react-document-title';
import EnabledFeature from '../library/EnabledFeature';
import HeaderUserDate from './HeaderUserDate/index';
import StatsContainer from './StatsContainer';
import AppsRequestsContainer from './AppsRequestsContainer/index';
import PatientInsightsContainer from './PatientInsightsContainer/index';
import DonnaToDoListContainer from './DonnaToDoListContainer/index';
import RevenueContainer from './RevenueContainer';
import { setDashboardDate } from '../../reducers/dashboard';
import { fetchEntitiesRequest } from '../../thunks/fetchEntities';
import { fetchDonnasToDos } from '../../thunks/dashboard';
import { getStyles } from './styles';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.fetchEntitiesRequest({ key: 'users' });
    this.props.fetchEntitiesRequest({
      id: 'dashAccount',
      key: 'accounts',
    });
  }

  render() {
    const { users, userId, useCCPReSkinning } = this.props;
    const styles = getStyles(useCCPReSkinning);
    const user = users.get(userId);
    const userName = user ? user.get('firstName') : '';

    return (
      <DocumentTitle title="CareCru | Dashboard">
        <div className={styles.dashboard}>
          <HeaderUserDate
            user={userName}
            dashboardDate={this.props.dashboardDate}
            setDashboardDate={this.props.setDashboardDate}
          />
          <EnabledFeature
            predicate={({ flags }) => flags.get('production-data-in-dashboard')}
            render={() => (
              <div className={styles.revenueColFlex}>
                <RevenueContainer dashboardDate={this.props.dashboardDate} />
                <StatsContainer dashboardDate={this.props.dashboardDate} />
              </div>
            )}
            fallback={() => (
              <StatsContainer
                dashboardDate={this.props.dashboardDate}
                overrideClassName={styles.statsContainer}
                overrideStatClassName={styles.statContainer}
              />
            )}
          />
          <div className={styles.colFlex}>
            <AppsRequestsContainer dashboardDate={this.props.dashboardDate} />
            <PatientInsightsContainer dashboardDate={this.props.dashboardDate} />
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

function mapStateToProps({ entities, dashboard, auth, featureFlags }) {
  const useCCPReSkinning = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'use-ccp-reskinning-ui',
  );
  return {
    users: entities.getIn(['users', 'models']),
    dashboardDate: dashboard.get('dashboardDate'),
    dashboard,
    userId: auth.get('userId'),
    useCCPReSkinning,
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
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  setDashboardDate: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  fetchDonnasToDos: PropTypes.func.isRequired,
  useCCPReSkinning: PropTypes.bool.isRequired,
  dashboard: PropTypes.shape({
    dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
    loadingInsights: PropTypes.bool,
    loadingToDos: PropTypes.bool,
    insightCount: PropTypes.number,
    insights: PropTypes.arrayOf(PropTypes.any),
    reminders: PropTypes.arrayOf(PropTypes.any),
    reviews: PropTypes.arrayOf(PropTypes.any),
    recalls: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
  userId: PropTypes.string.isRequired,
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
