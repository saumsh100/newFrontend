
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import moment from 'moment';
import { connect } from 'react-redux';
import { setDateToTimezone } from '@carecru/isomorphic';
import Loader from '../components/Loader';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../thunks/fetchEntities';
import { deleteAllEntity } from '../reducers/entities';
import { appointmentShape } from '../components/library/PropTypeShapes';
import Account from '../entities/models/Account';
import Appointment from '../entities/models/Appointments';
import {
  setScheduleDate,
  selectAppointment,
  setMergingPatient,
  setCreatingPatient,
} from '../actions/schedule';
import { setAllFilters } from '../thunks/schedule';

class ScheduleContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: 20 * 1000,
    };

    this.refetchRecentlyUpdatedAppointments = this.refetchRecentlyUpdatedAppointments.bind(this);
    this.buildEventsQuery = this.buildEventsQuery.bind(this);
  }

  componentDidMount() {
    const currentDate = setDateToTimezone(this.props.currentDate);
    const appointmentsQuery = this.buildAppointmentQuery(currentDate);
    const eventsQuery = this.buildEventsQuery(currentDate);

    this.timerID = setInterval(this.refetchRecentlyUpdatedAppointments, this.state.timeout);

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'appSchedule',
        key: 'appointments',
        join: ['patient', 'service'],
        params: appointmentsQuery,
      }),
      this.props.fetchEntitiesRequest({
        id: 'eventsSchedule',
        key: 'events',
        params: eventsQuery,
      }),
      this.props.fetchEntitiesRequest({
        id: 'pracSchedule',
        key: 'practitioners',
        join: ['services'],
      }),
      this.props.fetchEntitiesRequest({
        id: 'chairsSchedule',
        key: 'chairs',
      }),
      this.props.fetchEntitiesRequest({
        id: 'accountsSchedule',
        key: 'accounts',
      }),
    ])
      .then(() => {
        this.props.setAllFilters(['chairs', 'practitioners', 'services']);
      })
      .catch(console.error);
  }

  componentDidUpdate(prevProps) {
    const previousDate = setDateToTimezone(prevProps.currentDate);
    const nextPropsDate = setDateToTimezone(this.props.schedule.toJS().scheduleDate);

    if (this.isSameDay(previousDate, nextPropsDate)) {
      const appointmentsQuery = this.buildAppointmentQuery(nextPropsDate);
      const eventsQuery = this.buildEventsQuery(nextPropsDate);

      Promise.all([
        this.props.deleteAllEntity('appointments'),
        this.props.deleteAllEntity('events'),
      ]).then(() =>
        Promise.all([
          this.props.fetchEntitiesRequest({
            id: 'appSchedule',
            key: 'appointments',
            join: ['patient'],
            params: appointmentsQuery,
          }),
          this.props.fetchEntitiesRequest({
            id: 'eventsSchedule',
            key: 'events',
            params: eventsQuery,
          }),
        ]));
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  buildAppointmentQuery(date, filterOverride = {}, queryOverride = {}) {
    const startDate = date.startOf('day').toISOString();
    const endDate = date.endOf('day').toISOString();
    const query = {
      startDate,
      endDate,
      filters: [
        {
          isMissed: false,
          isPending: false,
          isCancelled: false,
          isDeleted: false,
          ...filterOverride,
        },
      ],
      ...queryOverride,
    };

    return query;
  }

  buildEventsQuery(date, queryOverride = {}) {
    const accountId = this.props.activeAccount.get('id');
    const startDate = date.startOf('day').toISOString();
    const endDate = date.endOf('day').toISOString();
    const query = {
      accountId,
      'startDate[between][0]': startDate,
      'startDate[between][1]': endDate,
      ...queryOverride,
    };

    return query;
  }

  isSameDay(currentDate, updateDate) {
    return (
      !updateDate.isSame(currentDate, 'month') ||
      !updateDate.isSame(currentDate, 'day') ||
      !updateDate.isSame(currentDate, 'year')
    );
  }

  refetchRecentlyUpdatedAppointments() {
    const currentDate = setDateToTimezone(this.props.currentDate);
    const fiveMinutesAgo = setDateToTimezone()
      .subtract(1, 'minutes')
      .toISOString();

    const apppointmentsQuery = this.buildAppointmentQuery(
      currentDate,
      {
        isMissed: undefined,
        isPending: undefined,
        isDeleted: undefined,
        isCancelled: undefined,
        updatedAt: {
          $gte: fiveMinutesAgo,
        },
      },
      {
        isParanoid: false,
      },
    );

    const eventsQuery = this.buildEventsQuery(currentDate, {
      'updatedAt[gte]': fiveMinutesAgo,
      paranoid: false,
    });

    Promise.all([
      this.props.fetchEntities({
        id: 'appSchedule',
        key: 'appointments',
        join: ['patient', 'service'],
        params: apppointmentsQuery,
      }),
      this.props.fetchEntities({
        id: 'eventsSchedule',
        key: 'events',
        params: eventsQuery,
      }),
    ]);
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
      events,
      services,
      patients,
      chairs,
      activeAccount,
    } = this.props;

    return (
      <Loader isLoaded={!!activeAccount}>
        <ScheduleComponent
          practitioners={practitioners}
          schedule={schedule}
          appointments={appointments}
          events={events}
          services={services}
          patients={patients}
          chairs={chairs}
          unit={activeAccount}
          setMergingPatient={this.props.setMergingPatient}
          setCreatingPatient={this.props.setCreatingPatient}
          createEntityRequest={this.props.createEntityRequest}
          appsFetched={this.props.appsFetched}
          eventsFetched={this.props.eventsFetched}
          pracsFetched={this.props.pracsFetched}
          chairsFetched={this.props.chairsFetched}
          accountsFetched={this.props.accountsFetched}
          setScheduleDate={this.props.setScheduleDate}
          selectedAppointment={this.props.selectedAppointment}
          selectAppointment={this.props.selectAppointment}
        />
      </Loader>
    );
  }
}

function mapStateToProps({ apiRequests, entities, schedule, auth }) {
  const waitForAuth = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);

  const appsFetched = apiRequests.get('appSchedule')
    ? apiRequests.get('appSchedule').wasFetched
    : null;
  const eventsFetched = apiRequests.get('eventsSchedule')
    ? apiRequests.get('eventsSchedule').wasFetched
    : null;
  const pracsFetched = apiRequests.get('pracSchedule')
    ? apiRequests.get('pracSchedule').wasFetched
    : null;
  const chairsFetched = apiRequests.get('chairsSchedule')
    ? apiRequests.get('chairsSchedule').wasFetched
    : null;
  const accountsFetched = apiRequests.get('accountsSchedule')
    ? apiRequests.get('accountsSchedule').wasFetched
    : null;

  return {
    schedule,
    currentDate: schedule.toJS().scheduleDate,
    selectedAppointment: schedule.toJS().selectedAppointment,
    practitioners: entities.get('practitioners'),
    appointments: entities.get('appointments'),
    events: entities.get('events'),
    patients: entities.get('patients'),
    services: entities.get('services'),
    chairs: entities.get('chairs'),
    activeAccount,
    appsFetched,
    eventsFetched,
    pracsFetched,
    chairsFetched,
    accountsFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createEntityRequest,
      fetchEntities,
      fetchEntitiesRequest,
      deleteAllEntity,
      setAllFilters,
      setScheduleDate,
      selectAppointment,
      setMergingPatient,
      setCreatingPatient,
    },
    dispatch,
  );
}

ScheduleContainer.propTypes = {
  schedule: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  currentDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.instanceOf(moment)]),
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  events: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  services: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  patients: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  chairs: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  activeAccount: PropTypes.instanceOf(Account),
  selectedAppointment: PropTypes.oneOfType([
    PropTypes.instanceOf(Appointment),
    PropTypes.shape(appointmentShape),
  ]),
  setCreatingPatient: PropTypes.func.isRequired,
  setAllFilters: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
  setScheduleDate: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  setMergingPatient: PropTypes.func.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  appsFetched: PropTypes.bool,
  eventsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  accountsFetched: PropTypes.bool,
};

ScheduleContainer.defaultProps = {
  currentDate: new Date(),
  appsFetched: false,
  eventsFetched: false,
  pracsFetched: false,
  chairsFetched: false,
  accountsFetched: false,
  selectedAppointment: null,
  activeAccount: undefined,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScheduleContainer);
