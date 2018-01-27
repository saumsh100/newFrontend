
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Card,
} from '../../library';
import styles from './styles.scss';
import Insights from './Insights';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { fetchInsights } from '../../../thunks/dashboard';
import { FilterPatients, FilterAppointments } from '../Shared/filters';

class PatientInsightsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchInsights();
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);
    const nextPropsDate = moment(nextProps.dashboardDate);

    if (!nextPropsDate.isSame(currentDate, 'month') || !nextPropsDate.isSame(currentDate, 'day') || !nextPropsDate.isSame(currentDate, 'year')) {
      this.props.fetchInsights();
    }
  }

  render() {
    const {
      insights,
      appointments,
      patients,
    } = this.props;

    return (
      <Card className={styles.card} runAnimation loaded={!this.props.loadingInsights && this.props.dashAppointments && appointments && patients}>
        <div className={styles.container}>
          {!this.props.loadingInsights && this.props.dashAppointments && appointments && patients ? (
            <div className={styles.header}>
              <span className={styles.header_count}>{this.props.insightCount}&nbsp;</span>
              {this.props.insightCount === 1 ? 'Patient Insight' : 'Patient Insights'}
            </div>) : null}

          {!this.props.loadingInsights && this.props.dashAppointments && appointments && patients ?
            <Insights
              insights={insights}
              appointments={appointments}
              patients={patients}
            />
            : null }
        </div>
      </Card>
    );
  }
}

PatientInsightsContainer.propTypes = {
  insights: PropTypes.instanceOf(Array),
  loadingInsights: PropTypes.bool,
  dashAppointments: PropTypes.bool,
  appointments: PropTypes.object,
  patients: PropTypes.object,
  insightCount: PropTypes.number,
};

function mapStateToProps({ apiRequests, dashboard, entities }) {
  const dash = dashboard.toJS();
  const dashboardDate = dash.dashboardDate;

  const loadingInsights = dash.loadingInsights;
  const insights = dash.insights;
  const insightCount = dash.insightCount;

  const dashAppointments = (apiRequests.get('dashAppointments') ? apiRequests.get('dashAppointments').wasFetched : null);

  const appointments = entities.getIn(['appointments', 'models']);
  const filteredAppointments = FilterAppointments(appointments, moment(dashboardDate));

  const appPatientIds = filteredAppointments.toArray().map(app => app.get('patientId'));
  const patients = FilterPatients(entities.getIn(['patients', 'models']), appPatientIds);

  return {
    dashboardDate,
    insights,
    loadingInsights,
    patients,
    appointments,
    dashAppointments,
    insightCount,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
    fetchInsights,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientInsightsContainer);
