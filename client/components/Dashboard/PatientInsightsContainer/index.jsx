
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, getISODate } from '../../library';
import Insights from './Insights';
import InsightsHeader from './Insights/InsightsHeader';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import accountShape from '../../library/PropTypeShapes/accountShape';
import { fetchInsights } from '../../../thunks/dashboard';
import { FilterPatients, FilterAppointments } from '../Shared/filters';
import styles from './styles.scss';

class PatientInsightsContainer extends Component {
  componentDidMount() {
    this.props.fetchInsights();
  }

  componentDidUpdate(prevProps) {
    const currentDate = getISODate(this.props.dashboardDate, this.props.timezone);
    const previousDate = getISODate(prevProps.dashboardDate, this.props.timezone);

    if (currentDate !== previousDate) {
      this.props.fetchInsights();
    }
  }

  render() {
    const { insights, appointments, patients, wasAccountFetched, account } = this.props;

    const allFetched =
      !this.props.loadingInsights && this.props.dashAppointmentsFetched && wasAccountFetched;

    return (
      <Card className={styles.card} runAnimation loaded={allFetched}>
        <div className={styles.container}>
          {allFetched && (
            <InsightsHeader insightCount={this.props.insightCount} insights={insights} />
          )}

          {allFetched && (
            <Insights
              insights={insights}
              appointments={appointments}
              patients={patients}
              timezone={account.timezone}
            />
          )}
        </div>
      </Card>
    );
  }
}

function mapStateToProps({ apiRequests, dashboard, entities, auth }) {
  const dash = dashboard.toJS();
  const { dashboardDate, loadingInsights, insights, insightCount } = dash;

  const wasAccountFetched =
    apiRequests.get('dashAccount') && apiRequests.get('dashAccount').wasFetched;

  const dashAppointmentsFetched =
    apiRequests.get('dashAppointments') && apiRequests.get('dashAppointments').wasFetched;

  const appointments = entities.getIn(['appointments', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);
  const timezone = auth.get('timezone');
  const filteredAppointments = FilterAppointments(
    appointments,
    practitioners,
    dashboardDate,
    timezone,
  );

  const appPatientIds = filteredAppointments.map(app => app.get('patientId')).toArray();
  const patients = FilterPatients(entities.getIn(['patients', 'models']), appPatientIds);
  const account = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  return {
    account,
    dashboardDate,
    insights,
    loadingInsights,
    patients,
    appointments: filteredAppointments,
    dashAppointmentsFetched,
    insightCount,
    wasAccountFetched,
    timezone,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      fetchInsights,
    },
    dispatch,
  );
}

PatientInsightsContainer.propTypes = {
  insights: PropTypes.instanceOf(Array),
  loadingInsights: PropTypes.bool,
  dashAppointmentsFetched: PropTypes.bool,
  appointments: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  insightCount: PropTypes.number,
  fetchInsights: PropTypes.func.isRequired,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  wasAccountFetched: PropTypes.bool,
  account: PropTypes.shape(accountShape),
  timezone: PropTypes.string.isRequired,
};

PatientInsightsContainer.defaultProps = {
  insights: [],
  loadingInsights: false,
  dashAppointmentsFetched: false,
  appointments: Map,
  patients: Map,
  insightCount: 0,
  wasAccountFetched: false,
  account: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientInsightsContainer);
