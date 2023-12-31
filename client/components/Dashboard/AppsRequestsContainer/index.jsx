import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { FilterAppointments, FilterPatients } from '../Shared/filters';
import { Card, Tabs, Tab, getISODate, getDate } from '../../library';
import { selectedRequestBuilder } from '../../Utils';
import Requests from '../../Requests';
import DashboardWaitingRoomContainer from '../../WaitingRoom/DashboardWaitingRoomContainer';
import RequestsModel from '../../../entities/models/Request';
import AppointmentsList from './AppointmentsList';
import { selectAppointment, setScheduleDate } from '../../../actions/schedule';
import { isFeatureEnabledSelector } from '../../../reducers/featureFlags';
import styles from '../styles';

class AppsRequestsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      selectedApp: null,
    };
    this.handleAppointmentClick = this.handleAppointmentClick.bind(this);
    this.handleEditAppointment = this.handleEditAppointment.bind(this);
  }

  componentDidMount() {
    const currentDate = getDate(this.props.dashboardDate);
    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
      limit: 100,
      filters: [
        {
          isMissed: false,
          isPending: false,
          isCancelled: false,
          isDeleted: false,
        },
      ],
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'dashRequests',
        key: 'requests',
        join: ['service', 'patientUser', 'requestingPatientUser', 'practitioner'],
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

  componentDidUpdate(prevProps) {
    const currentDate = getDate(this.props.dashboardDate);
    const previousDate = getDate(prevProps.dashboardDate);
    if (
      !previousDate.isSame(currentDate, 'month') ||
      !previousDate.isSame(currentDate, 'day') ||
      !previousDate.isSame(currentDate, 'year')
    ) {
      const startDate = currentDate.startOf('day').toISOString();
      const endDate = currentDate.endOf('day').toISOString();
      const query = {
        startDate,
        endDate,
        limit: 100,
        filters: [
          {
            isMissed: false,
            isPending: false,
            isCancelled: false,
            isDeleted: false,
          },
        ],
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
    const { appointments } = this.props;

    this.props.setScheduleDate({
      scheduleDate: getISODate(this.props.dashboardDate),
    });

    this.props.push('/schedule');
    const app = appointments.get(id);
    const mergeApp = Object.assign(app.toJS(), { appModel: app });
    this.props.selectAppointment(mergeApp);
  }

  render() {
    const {
      appointments,
      filteredRequests,
      sortedRequests,
      requestId,
      selectedRequest,
      patients,
      dashAppointments,
      waitingRoomQueueLength,
      canSeeVirtualWaitingRoom,
    } = this.props;

    const { index } = this.state;

    const isLoaded = dashAppointments;

    const displayWaitingRoom = isLoaded ? <DashboardWaitingRoomContainer /> : null;

    const displayRequests = isLoaded ? (
      <Requests
        requests={this.props.requests}
        filteredRequests={filteredRequests}
        sortedRequests={sortedRequests}
        requestId={requestId}
        selectedRequest={selectedRequest}
        services={this.props.services}
        patientUsers={this.props.patientUsers}
        practitioners={this.props.practitioners}
        popoverRight="right"
        noBorder
        disableHeader
        runAnimation={false}
        isLoaded
        tab="dasboardReq"
        redirect={{
          pathname: '/schedule',
        }}
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

    const display = canSeeVirtualWaitingRoom
      ? [displayWaitingRoom, displayRequests, displayApps][index]
      : [displayRequests, displayApps][index];

    return (
      <Card runAnimation loaded={isLoaded} className={styles.appRequestContainer_card}>
        <div>
          {isLoaded &&
            (canSeeVirtualWaitingRoom ? (
              <Tabs index={index} onChange={(i) => this.setState({ index: i })} noUnderLine>
                <Tab
                  label={`${waitingRoomQueueLength} Waiting Room`}
                  className={styles.appRequestContainer_tab}
                  activeClass={styles.appRequestContainer_activeTab}
                />
                <Tab
                  label={`${filteredRequests.length} Online Req`}
                  className={styles.appRequestContainer_tab}
                  activeClass={styles.appRequestContainer_activeTab}
                />
                <Tab
                  label={`${appointments.size} Appointments`}
                  className={styles.appRequestContainer_tab}
                  activeClass={styles.appRequestContainer_activeTab}
                />
              </Tabs>
            ) : (
              <Tabs index={index} onChange={(i) => this.setState({ index: i })} noUnderLine>
                <Tab
                  label={`${filteredRequests.length} Online Requests`}
                  className={styles.appRequestContainer_tab}
                  activeClass={styles.appRequestContainer_activeTab}
                />
                <Tab
                  label={`${appointments.size} Appointments`}
                  className={styles.appRequestContainer_tab}
                  activeClass={styles.appRequestContainer_activeTab}
                />
              </Tabs>
            ))}
        </div>
        <div className={styles.appRequestContainer_container}>{display}</div>
      </Card>
    );
  }
}

const dateFilter = (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate);

function mapStateToProps(
  { apiRequests, entities, router, featureFlags, waitingRoom, auth },
  { dashboardDate, ...ownProps },
) {
  const dashAppointments =
    apiRequests.get('dashAppointments') && apiRequests.get('dashAppointments').wasFetched;

  const dashRequests =
    apiRequests.get('dashRequests') && apiRequests.get('dashRequests').wasFetched;

  const dashChairs = apiRequests.get('dashChairs') && apiRequests.get('dashChairs').wasFetched;

  const dashPracs = apiRequests.get('dashPracs') && apiRequests.get('dashPracs').wasFetched;

  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);
  const chairs = entities.getIn(['chairs', 'models']);
  const appointments = entities.getIn(['appointments', 'models']);
  const timezone = auth.get('timezone');
  const filteredAppointments = FilterAppointments(
    appointments,
    practitioners,
    dashboardDate,
    timezone,
  );

  const appPatientIds = filteredAppointments.map((app) => app.get('patientId')).toArray();

  const patients = FilterPatients(entities.getIn(['patients', 'models']), appPatientIds);

  const filteredRequests = requests
    .filter((req) => !req.get('isCancelled') && !req.get('isConfirmed'))
    .toArray();

  const sortedRequests = filteredRequests.sort(dateFilter);

  const nextProps = {
    router,
    sortedRequests,
    ...ownProps,
  };

  const canSeeVirtualWaitingRoom = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'virtual-waiting-room-ui',
  );

  const waitingRoomQueue = waitingRoom.get('waitingRoomQueue');

  return {
    requests,
    filteredRequests,
    sortedRequests,
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
    ...selectedRequestBuilder(nextProps),
    waitingRoomQueueLength: waitingRoomQueue ? waitingRoomQueue.length : 0,
    canSeeVirtualWaitingRoom,
    timezone,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      setScheduleDate,
      selectAppointment,
      push,
    },
    dispatch,
  );
}

AppsRequestsContainer.propTypes = {
  appointments: PropTypes.instanceOf(Map),
  chairs: PropTypes.instanceOf(Map),
  dashAppointments: PropTypes.bool,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  patientUsers: PropTypes.instanceOf(Map),
  patients: PropTypes.instanceOf(Map),
  practitioners: PropTypes.instanceOf(Map),
  push: PropTypes.func.isRequired,
  requests: PropTypes.instanceOf(Map),
  filteredRequests: PropTypes.arrayOf(RequestsModel),
  sortedRequests: PropTypes.arrayOf(RequestsModel),
  requestId: PropTypes.string,
  selectedRequest: PropTypes.instanceOf(RequestsModel),
  selectAppointment: PropTypes.func.isRequired,
  services: PropTypes.instanceOf(Map),
  setScheduleDate: PropTypes.func.isRequired,
  waitingRoomQueueLength: PropTypes.number.isRequired,
  canSeeVirtualWaitingRoom: PropTypes.bool.isRequired,
};

AppsRequestsContainer.defaultProps = {
  appointments: Map,
  chairs: Map,
  dashAppointments: false,
  patientUsers: Map,
  patients: Map,
  practitioners: Map,
  requests: Map,
  filteredRequests: [],
  sortedRequests: [],
  selectedRequest: RequestsModel,
  services: Map,
  requestId: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(AppsRequestsContainer);
