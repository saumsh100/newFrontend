
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { push } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { FilterAppointments, FilterPatients } from '../Shared/filters';
import {
  Card,
  Tabs,
  Tab,
} from '../../library';
import Requests from '../../../components/Requests';
import AppointmentsList from './AppointmentsList';
import styles from './styles.scss';
import { selectAppointment, setScheduleDate } from '../../../actions/schedule';

class AppsRequestsContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      selectedApp: null,
    };
    this.handleAppointmentClick = this.handleAppointmentClick.bind(this);
    this.handleEditAppointment = this.handleEditAppointment.bind(this);

  }

  componentDidMount() {
    const currentDate = moment(this.props.dashboardDate);
    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
      limit: 100,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'dashRequests',
        key: 'requests',
        join: ['service', 'patientUser', 'practitioner'] ,
      }),
      this.props.fetchEntitiesRequest({
        id: 'dashAppointments',
        key: 'appointments',
        join: ['patient'],
        params: query,
      }),
      this.props.fetchEntitiesRequest({
        id: 'dashPracs',
        key: 'practitioners',
      }),
      this.props.fetchEntitiesRequest({
        id: 'dashChairs',
        key: 'chairs',
      }),
    ]);
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.dashboardDate);

    const nextPropsDate = moment(nextProps.dashboardDate);

    if (!nextPropsDate.isSame(currentDate, 'month') || !nextPropsDate.isSame(currentDate, 'day') || !nextPropsDate.isSame(currentDate, 'year')) {
      const startDate = nextPropsDate.startOf('day').toISOString();
      const endDate = nextPropsDate.endOf('day').toISOString();
      const query = {
        startDate,
        endDate,
        limit: 100,
      };

      this.props.fetchEntitiesRequest({
        id: 'dashAppointments',
        key: 'appointments',
        join: ['patient'],
        params: query,
      });
    }
  }

  handleAppointmentClick(id) {
    this.setState({
      selectedApp: id,
    });
  }

  handleEditAppointment(id) {
    const {
      push,
      selectAppointment,
      appointments,
    } = this.props;

    this.props.setScheduleDate({ scheduleDate: moment(this.props.dashboardDate) });

    push('/schedule');
    const app = appointments.get(id);
    const mergeApp = Object.assign(app.toJS(), { appModel: app });
    selectAppointment(mergeApp);
  }


  render() {
    const {
      appointments,
      requests,
      patients,
      dashPracs,
      dashAppointments,
      dashChairs,
      dashRequests,
    } = this.props;

    const {
      index,
    } = this.state;

    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    const filteredRequests = requests.filter((req) => {
      return !req.get('isCancelled') && !req.get('isConfirmed');
    });

    const isLoaded = dashAppointments;

    const displayRequests = isLoaded ? (
      <Requests
        requests={this.props.requests}
        services={this.props.services}
        patientUsers={this.props.patientUsers}
        practitioners={this.props.practitioners}
        location={location}
        popoverRight="right"
        noBorder
        disableHeader
        runAnimation={false}
        isLoaded
      />
    ) : null;

    const displayApps = isLoaded ? (
      <AppointmentsList
        appointments={appointments}
        patients={patients}
        handleAppointmentClick={this.handleAppointmentClick}
        selectedApp={this.state.selectedApp}
        chairs={this.props.chairs}
        practitioners={this.props.practitioners}
        handleEditAppointment={this.handleEditAppointment}
        scrollComponentDidMount={this.scrollComponentDidMount}
      />
    ) : null;

    return (
      <Card runAnimation loaded={isLoaded} className={styles.card}>
        <div className={styles.tabsContainer}>
          {isLoaded ? (<Tabs
            index={index}
            onChange={i => this.setState({ index: i })}
            noUnderLine
          >
            <Tab
              label={`${filteredRequests.size} Online Requests`}
              className={styles.tab}
              activeClass={styles.activeTab}
            />
            <Tab
              label={`${appointments.size} Appointments`}
              className={styles.tab}
              activeClass={styles.activeTab}
            />
          </Tabs>) : null }
        </div>
        <div className={styles.container}>
          {index === 0 ? displayRequests : displayApps}
        </div>
      </Card>
    );
  }
}

AppsRequestsContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func,
  requests: PropTypes.object,
  services: PropTypes.object,
  patientUsers: PropTypes.object,
  practitioners: PropTypes.object,
  appointments: PropTypes.object,
  patients: PropTypes.object,
  dashboardDate: PropTypes.instanceOf(Date),
  selectAppointment: PropTypes.func,
  push: PropTypes.func,
  dashPracs: PropTypes.bool,
  dashAppointments: PropTypes.bool,
  dashChairs: PropTypes.bool,
  dashRequests: PropTypes.bool,
};

function mapStateToProps({ apiRequests, entities }, { dashboardDate }) {
  const dashAppointments = (apiRequests.get('dashAppointments') ? apiRequests.get('dashAppointments').wasFetched : null);
  const dashRequests = (apiRequests.get('dashRequests') ? apiRequests.get('dashRequests').wasFetched : null);
  const dashChairs = (apiRequests.get('dashChairs') ? apiRequests.get('dashChairs').wasFetched : null);
  const dashPracs = (apiRequests.get('dashPracs') ? apiRequests.get('dashPracs').wasFetched : null);

  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);
  const chairs = entities.getIn(['chairs', 'models']);
  const appointments = entities.getIn(['appointments', 'models']);

  const filteredAppointments = FilterAppointments(appointments, moment(dashboardDate));

  const appPatientIds = filteredAppointments.toArray().map(app => app.get('patientId'));

  const patients = FilterPatients(entities.getIn(['patients', 'models']), appPatientIds);

  return {
    requests,
    services,
    patientUsers,
    practitioners,
    patients,
    chairs,
    appointments: filteredAppointments,
    dashChairs,
    dashPracs,
    dashAppointments,
    dashRequests,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
    setScheduleDate,
    selectAppointment,
    push,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AppsRequestsContainer)
