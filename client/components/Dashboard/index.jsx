
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jwt from 'jwt-decode';
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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntitiesRequest({ key: 'users' });
    this.props.fetchEntitiesRequest({
      id: 'dashAccount',
      key: 'accounts',
    });
  }

  render() {
    const {
      users,
    } = this.props;

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
            <RevenueContainer
              dashboardDate={this.props.dashboardDate}
            />
            <StatsContainer
              dashboardDate={this.props.dashboardDate}
            />
          </div>

          <div className={styles.colFlex}>
            <AppsRequestsContainer
              dashboardDate={this.props.dashboardDate}
            />

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

Dashboard.propTypes = {
  users: PropTypes.object,
  dashboardDate: PropTypes.instanceOf(Date),
  setDashboardDate: PropTypes.func,
  fetchEntitiesRequest: PropTypes.func,
};

function mapStateToProps({ entities, dashboard }) {
  return {
    users: entities.getIn(['users', 'models']),
    dashboardDate: dashboard.toJS().dashboardDate,
    dashboard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
    fetchDonnasToDos,
    setDashboardDate,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
