
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities, fetchEntitiesRequest, createEntityRequest } from '../thunks/fetchEntities';
import {
  setScheduleDate,
  selectAppointment,
  setMergingPatient,
  setCreatingPatient,
} from '../actions/schedule';

import {
  setAllFilters,
} from '../thunks/schedule';

class ScheduleContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const currentDate = moment(this.props.currentDate);

    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
      limit: 350,
    };

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
        join: ['weeklySchedule', 'services'],
      }),
      this.props.fetchEntitiesRequest({
        id: 'chairsSchedule',
        key: 'chairs',
      }),
      this.props.fetchEntitiesRequest({
        id: 'accountsSchedule',
        key: 'accounts',
      }),
    ]).then(() => {
      this.props.setAllFilters(['chairs', 'practitioners', 'services']);
    }).catch(e => console.log(e));
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.currentDate);

    const nextPropsDate = moment(nextProps.schedule.toJS().scheduleDate);

    if (!nextPropsDate.isSame(currentDate, 'month') || !nextPropsDate.isSame(currentDate, 'day') || !nextPropsDate.isSame(currentDate, 'year')) {
      const startDate = nextPropsDate.startOf('day').toISOString();
      const endDate = nextPropsDate.endOf('day').toISOString();
      const query = {
        startDate,
        endDate,
        limit: 150,
      };
      this.props.fetchEntitiesRequest({
        id: 'appSchedule',
        key: 'appointments',
        join: ['patient'],
        params: query,
      });
    }
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
      setScheduleDate,
      setMergingPatient,
      selectedAppointment,
      selectAppointment,
      services,
      patients,
      chairs,
      weeklySchedules,
      timeOffs,
      activeAccount,
    } = this.props;

    return (
      <ScheduleComponent
        practitioners={practitioners}
        schedule={schedule}
        appointments={appointments}
        setScheduleDate={setScheduleDate}
        selectedAppointment={selectedAppointment}
        selectAppointment={selectAppointment}
        services={services}
        patients={patients}
        chairs={chairs}
        weeklySchedules={weeklySchedules}
        timeOffs={timeOffs}
        setMergingPatient={setMergingPatient}
        unit={activeAccount}
        setCreatingPatient={this.props.setCreatingPatient}
        createEntityRequest={this.props.createEntityRequest}
        appsFetched={this.props.appsFetched}
        pracsFetched={this.props.pracsFetched}
        chairsFetched={this.props.chairsFetched}
        accountsFetched={this.props.accountsFetched}
      />
    );
  }
}

ScheduleContainer.propTypes = {
  setAllFilters: PropTypes.func,
  fetchEntities: PropTypes.func,
  fetchEntitiesRequest: PropTypes.func,
  setScheduleDate: PropTypes.func,
  practitioners: PropTypes.object,
  currentDate: PropTypes.object,
  appointments: PropTypes.object,
  schedule: PropTypes.object,
  services: PropTypes.object,
  patients: PropTypes.object,
  chairs: PropTypes.object,
  setCreatingPatient: PropTypes.func,
  appsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  accountsFetched: PropTypes.bool,
};

function mapStateToProps({ apiRequests, entities, schedule, auth }) {

  const weeklySchedules = entities.getIn(['weeklySchedules', 'models'])
  const timeOffs = entities.getIn(['timeOffs', 'models']);
  const waitForAuth = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);

  const appsFetched = (apiRequests.get('appSchedule') ? apiRequests.get('appSchedule').wasFetched : null);
  const pracsFetched = (apiRequests.get('pracSchedule') ? apiRequests.get('pracSchedule').wasFetched : null);
  const chairsFetched = (apiRequests.get('chairsSchedule') ? apiRequests.get('chairsSchedule').wasFetched : null);
  const accountsFetched = (apiRequests.get('accountsSchedule') ? apiRequests.get('accountsSchedule').wasFetched : null);

  return {
    schedule,
    currentDate: schedule.toJS().scheduleDate,
    selectedAppointment: schedule.toJS().selectedAppointment,
    practitioners: entities.get('practitioners'),
    appointments: entities.get('appointments'),
    patients: entities.get('patients'),
    services: entities.get('services'),
    chairs: entities.get('chairs'),
    weeklySchedules,
    timeOffs,
    activeAccount,
    appsFetched,
    pracsFetched,
    chairsFetched,
    accountsFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    fetchEntities,
    fetchEntitiesRequest,
    setAllFilters,
    setScheduleDate,
    selectAppointment,
    setMergingPatient,
    setCreatingPatient,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ScheduleContainer);
