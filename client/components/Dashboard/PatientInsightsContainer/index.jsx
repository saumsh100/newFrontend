
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card } from '../../library';
import styles from './styles.scss';
import Insights from './Insights';
import InsightsHeader from './Insights/InsightsHeader';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { fetchInsights } from '../../../thunks/dashboard';
import { FilterPatients, FilterAppointments } from '../Shared/filters';

class PatientInsightsContainer extends Component {
  componentDidMount() {
    this.props.fetchInsights();
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);
    const nextPropsDate = moment(nextProps.dashboardDate);

    if (
      !nextPropsDate.isSame(currentDate, 'month') ||
      !nextPropsDate.isSame(currentDate, 'day') ||
      !nextPropsDate.isSame(currentDate, 'year')
    ) {
      this.props.fetchInsights();
    }
  }

  render() {
    const { insights, appointments, patients } = this.props;

    const allFetched = !this.props.loadingInsights && this.props.dashAppointmentsFetched;

    return (
      <Card className={styles.card} runAnimation loaded={allFetched}>
        <div className={styles.container}>
          {allFetched && (
            <InsightsHeader insightCount={this.props.insightCount} insights={insights} />
          )}

          {allFetched && (
            <Insights insights={insights} appointments={appointments} patients={patients} />
          )}
        </div>
      </Card>
    );
  }
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
};

PatientInsightsContainer.defaultProps = {
  insights: [],
  loadingInsights: false,
  dashAppointmentsFetched: false,
  appointments: Map,
  patients: Map,
  insightCount: 0,
};

function mapStateToProps({ apiRequests, dashboard, entities }) {
  const dash = dashboard.toJS();
  const dashboardDate = dash.dashboardDate;

  const loadingInsights = dash.loadingInsights;
  const insights = dash.insights;
  const insightCount = dash.insightCount;

  const dashAppointmentsFetched =
    apiRequests.get('dashAppointments') && apiRequests.get('dashAppointments').wasFetched;

  const appointments = entities.getIn(['appointments', 'models']);
  const filteredAppointments = FilterAppointments(appointments, moment(dashboardDate));

  const appPatientIds = filteredAppointments.toArray().map(app => app.get('patientId'));
  const patients = FilterPatients(entities.getIn(['patients', 'models']), appPatientIds);

  return {
    dashboardDate,
    insights,
    loadingInsights,
    patients,
    appointments: filteredAppointments,
    dashAppointmentsFetched,
    insightCount,
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

export default connect(mapStateToProps, mapDispatchToProps)(PatientInsightsContainer);
