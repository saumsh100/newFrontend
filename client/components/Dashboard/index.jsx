
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import moment from 'moment';
import RequestsContainer from '../../containers/RequestContainer';
import { push } from 'react-router-redux';
import { fetchEntities } from '../../thunks/fetchEntities';
import { selectAppointment } from '../../actions/schedule';
import {
  Grid,
  Row,
  Col,
  Card,
  CardHeader,
  DashboardStats,
  BigCommentBubble,
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
      // this.props.fetchEntities({ key: 'requests' }),
      this.props.fetchEntities({ key: 'appointments', join: ['patient'], params: query }),
      this.props.fetchEntities({ key: 'practitioners', join: ['services'] }),
      this.props.fetchEntities({ key: 'chairs' }),
      this.props.fetchEntities({ key: 'sentReminders', join: ['reminder', 'appointment', 'patient'] }),
      this.props.fetchEntities({ key: 'sentRecalls', join: ['recall', 'patient'] }),
    ]).then(() => {
      this.setState({ loaded: true });
    }).catch(e => console.log(e));
  }
  renderCards() {
    const {
      appointments,
      requests,
      reminders,
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
    } = this.props;

    const today = moment();

    const appointmentFilter = appointments.filter((app) => {
      const sDate = moment(app.startDate);
      const isSameDate = today.isSame(sDate, 'day');
      return (isSameDate && !app.isDeleted && !app.isCancelled);
    });

    const filterConfirmedRequests = requests.toArray().filter((req) => !req.get('isCancelled'));

    const data = [
      { count: appointmentFilter.size, title: 'Appointments Today', icon: 'calendar', size: 6, color: 'primaryColor' },
      { count: filterConfirmedRequests.length, title: 'Appointment Requests', icon: 'user', size: 6, color: 'primaryBlue' },
      { count: sentReminders.size, title: 'Reminders Sent', icon: 'bullhorn', size: 6, color: 'primaryGreen' },
      { count: sentRecalls.size, title: 'Recalls Sent', icon: 'star', size: 6, color: 'primaryYellow' },
    ];

    return (
      <Grid className={styles.dashboard}>
        <Row className={styles.dashboard__header}>
          <Col xs={12} >
            <Card className={styles.dashboard__header_title}>
              Welcome Back, <b>Justin</b>
            </Card>
          </Col>
        </Row>
        <Row className={styles.dashboard__body}>
          <Col xs={12}>
            <DashboardStats data={data} />
          </Col>
          <Col className={styles.padding} xs={12} md={12} lg={8}>
            <Card className={styles.dashboard__body_comments} >
              <CardHeader className={styles.cardHeader} title="Appointments" count={appointmentFilter.size} />
              <AppointmentsList
                appointments={appointmentFilter}
                chairs={chairs}
                patients={patients}
                services={services}
                practitioners={practitioners}
                selectAppointment={selectAppointment}
                push={push}
              />
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={12} lg={4}>
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
  return {
    appointments: entities.getIn(['appointments', 'models']),
    patients: entities.getIn(['patients', 'models']),
    practitioners: entities.getIn(['practitioners', 'models']),
    services: entities.getIn(['services', 'models']),
    requests: entities.getIn(['requests', 'models']),
    chairs: entities.getIn(['chairs', 'models']),
    reminders: entities.getIn(['reminders', 'models']),
    sentReminders: entities.getIn(['sentReminders', 'models']),
    recalls: entities.getIn(['recalls', 'models']),
    sentRecalls: entities.getIn(['sentRecalls', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    push,
    setSelectedPatientId: Actions.setSelectedPatientIdAction,
    selectAppointment,

  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
