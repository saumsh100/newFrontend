
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import moment from 'moment';
import jwt from 'jwt-decode';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import RequestsContainer from '../../containers/RequestContainer';
import { fetchEntities } from '../../thunks/fetchEntities';
import { selectAppointment, setScheduleDate } from '../../actions/schedule';
import {
  Grid,
  Row,
  Col,
  Card,
  CardHeader,
  DashboardStats,
} from '../library';
import RemindersList from './Cards/RemindersList';
import RecallsList from './Cards/RecallsList';
import DigitalWaitList from '../DigitalWaitList';
import AppointmentsList from './Cards/AppointmentsList';
import * as Actions from '../../actions/patientList';
import styles from './styles.scss';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const currentDate = moment();
    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
      limit: 100,
    };

    Promise.all([
      this.props.fetchEntities({ key: 'users' }),
      this.props.fetchEntities({ key: 'appointments', join: ['patient', 'chair'], params: query }),
      this.props.fetchEntities({ key: 'practitioners', join: ['services'] }),
      this.props.fetchEntities({ key: 'sentReminders', join: ['reminder', 'appointment', 'patient'] }),
      this.props.fetchEntities({ key: 'sentRecalls', join: ['recall', 'patient'], params: query }),
    ]).then(() => {
      this.setState({ loaded: true });
    }).catch(e => console.log(e));
  }

  renderCards() {
    const {
      appointments,
      reminders,
      requests,
      patients,
      services,
      practitioners,
      chairs,
      push,
      sentReminders,
      recalls,
      sentRecalls,
      setSelectedPatientId,
      selectAppointment,
      setScheduleDate,
      users,
    } = this.props;

    const today = moment();

    const appointmentFilter = appointments.filter((app) => {
      const sDate = moment(app.startDate);
      const isSameDate = today.isSame(sDate, 'day');
      return (isSameDate && !app.isDeleted && !app.isCancelled && !app.mark && patients.get(app.get('patientId')));
    });

    const filterConfirmedRequests = requests.toArray().filter((req) => {
      return !req.get('isCancelled') && !req.get('isConfirmed');
    });

    const data = [
      { count: appointmentFilter.size, title: 'Appointments Today', icon: 'calendar', size: 6, color: 'primaryColor' },
      { count: filterConfirmedRequests.length, title: 'Appointment Requests', icon: 'user', size: 6, color: 'primaryBlue' },
      { count: sentReminders.size, title: 'Reminders Sent', icon: 'clock-o', size: 6, color: 'primaryGreen' },
      { count: sentRecalls.size, title: 'Recalls Sent', icon: 'bullhorn', size: 6, color: 'primaryYellow' },
    ];

    const token = localStorage.getItem('token');
    const decodedToken = jwt(token);
    const user = users.get(decodedToken.userId);
    const userShow = user ? user.get('firstName') : '';

    return (
      <DocumentTitle title="CareCru | Dashboard">
        <Grid className={styles.dashboard}>
          <Row className={styles.dashboard__header}>
            <Col xs={12} >
              <Card className={styles.dashboard__header_title} noBorder>
                Welcome Back, <b>{userShow}</b>
              </Card>
            </Col>
          </Row>
          <Row className={styles.dashboard__body}>
            <Col xs={12}>
              <DashboardStats data={data} />
            </Col>
            <Col className={styles.paddingStats} xs={12} md={12} lg={9}>
              <Card >
                <CardHeader
                  className={styles.cardHeader}
                  title="Appointments"
                  count={appointmentFilter.size}
                  data-test-id="appointmentCount"
                />
                <AppointmentsList
                  appointments={appointmentFilter}
                  chairs={chairs}
                  patients={patients}
                  services={services}
                  practitioners={practitioners}
                  selectAppointment={selectAppointment}
                  setSelectedPatientId={setSelectedPatientId}
                  push={push}
                />
              </Card>
            </Col>
            <Col className={styles.paddingStats} xs={12} md={12} lg={3}>
              <div className={styles.dashboard__body_request}>
                <RequestsContainer
                  key="dashBoardRequests"
                />
              </div>
            </Col>
            <Col xs={12}>
              <Row center="xs" className={styles.dashboard__patientList}>
                <Col className={styles.dashboard__patientList_item} xs={12} md={6} lg={4}>
                  <RecallsList
                    patients={patients}
                    recalls={recalls}
                    sentRecalls={sentRecalls}
                    setSelectedPatientId={setSelectedPatientId}
                    push={push}
                  />
                </Col>
                <Col className={styles.dashboard__patientList_item} xs={12} md={6} lg={4}>
                  <RemindersList
                    patients={patients}
                    appointments={appointments}
                    reminders={reminders}
                    sentReminders={sentReminders}
                    setSelectedPatientId={setSelectedPatientId}
                    setScheduleDate={setScheduleDate}
                    push={push}
                  />
                </Col>
                <Col className={styles.dashboard__patientList_item} xs={12} md={12} lg={4}>
                  <DigitalWaitList
                    setSelectedPatientId={setSelectedPatientId}
                    push={push}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </DocumentTitle>
    );
  }

  render() {
    return (
      <div className={styles.dashboardContainer}>
        <Loader loaded={this.state.loaded} color="#FF715A">
          {this.renderCards()}
        </Loader>
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  const appointments = entities.getIn(['appointments', 'models']);
  const sentReminders = entities.getIn(['sentReminders', 'models']);
  const sentRecalls = entities.getIn(['sentRecalls', 'models']);

  const appPatientIds = appointments.toArray().map(app => app.get('patientId'));
  const reminderPatientIds = sentReminders.toArray().map(sentReminder => sentReminder.get('patientId'))
  const recallPatientIds = sentRecalls.toArray().map(sentRecall => sentRecall.get('patientId'))

  const patients = entities.getIn(['patients', 'models']).filter((patient) => {
    return ((appPatientIds.indexOf(patient.get('id')) > -1 || reminderPatientIds.indexOf(patient.get('id')) > -1 ||
      recallPatientIds.indexOf(patient.get('id')) > -1)
      && !patient.get('isDeleted'));
  });

  return {
    appointments,
    patients,
    practitioners: entities.getIn(['practitioners', 'models']),
    services: entities.getIn(['services', 'models']),
    requests: entities.getIn(['requests', 'models']),
    chairs: entities.getIn(['chairs', 'models']),
    reminders: entities.getIn(['reminders', 'models']),
    sentReminders,
    sentRecalls,
    recalls: entities.getIn(['recalls', 'models']),
    users: entities.getIn(['users', 'models']),
  };
}

Dashboard.propTypes = {
  appointments: PropTypes.object.isRequired,
  reminders: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  practitioners: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  push: PropTypes.func,
  sentReminders: PropTypes.object,
  recalls: PropTypes.object,
  sentRecalls: PropTypes.object,
  setSelectedPatientId: PropTypes.func,
  selectAppointment: PropTypes.func,
  users: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    push,
    setSelectedPatientId: Actions.setSelectedPatientIdAction,
    selectAppointment,
    setScheduleDate,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
