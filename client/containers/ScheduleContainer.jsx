
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
      timer: null,
    };

    this.refetchRecentlyUpdatedAppointments = this.refetchRecentlyUpdatedAppointments.bind(this);
  }

  componentDidMount() {
    const currentDate = setDateToTimezone(this.props.currentDate);
    const query = this.buildAppointmentQuery(currentDate);

    const timer = setInterval(this.refetchRecentlyUpdatedAppointments, this.state.timeout);
    this.setState({ timer });

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'appSchedule',
        key: 'appointments',
        join: ['patient', 'service'],
        params: query,
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
      .catch(e => console.log(e));
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = setDateToTimezone(this.props.currentDate);
    const nextPropsDate = setDateToTimezone(nextProps.schedule.toJS().scheduleDate);

    if (this.isSameDay(currentDate, nextPropsDate)) {
      const query = this.buildAppointmentQuery(nextPropsDate);
      this.props.deleteAllEntity('appointments');
      this.props.fetchEntitiesRequest({
        id: 'appSchedule',
        key: 'appointments',
        join: ['patient'],
        params: query,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  buildAppointmentQuery(date, filterOverride = {}, queryOverride = {}) {
    const startDate = date.startOf('day').toISOString();
    const endDate = date.endOf('day').toISOString();
    const query = {
      startDate,
      endDate,
      filters: [
        {
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

    const query = this.buildAppointmentQuery(
      currentDate,
      {
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

    this.props.fetchEntities({
      id: 'appSchedule',
      key: 'appointments',
      join: ['patient', 'service'],
      params: query,
    });
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
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
          services={services}
          patients={patients}
          chairs={chairs}
          unit={activeAccount}
          setMergingPatient={this.props.setMergingPatient}
          setCreatingPatient={this.props.setCreatingPatient}
          createEntityRequest={this.props.createEntityRequest}
          appsFetched={this.props.appsFetched}
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
    patients: entities.get('patients'),
    services: entities.get('services'),
    chairs: entities.get('chairs'),
    activeAccount,
    appsFetched,
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
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  accountsFetched: PropTypes.bool,
};

ScheduleContainer.defaultProps = {
  currentDate: new Date(),
  appsFetched: false,
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
