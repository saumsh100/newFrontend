
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loader from 'react-loader';
import moment from 'moment';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities } from '../thunks/fetchEntities';
import { setScheduleDate, selectAppointment } from '../actions/schedule';

import {
  setAllFilters,
} from '../thunks/schedule';

class ScheduleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const currentDate = moment(this.props.currentDate);

    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
    };

    Promise.all([
      this.props.fetchEntities({ key: 'appointments', join: ['patient'], params: query }),
      this.props.fetchEntities({ key: 'practitioners', join: ['weeklySchedule', 'services', 'timeOffs'] }),
      this.props.fetchEntities({ key: 'chairs' }),
    ]).then(() => {
      this.props.setAllFilters(['chairs', 'practitioners', 'services']);
      this.setState({ loaded: true });
    }).catch(e => console.log(e));
  }

  componentWillReceiveProps(nextProps) {
    const currentDate = moment(this.props.currentDate);

    const nextPropsDate = moment(nextProps.schedule.toJS().scheduleDate);

    if (!nextPropsDate.isSame(currentDate)) {
      const startDate = nextPropsDate.startOf('day').toISOString();
      const endDate = nextPropsDate.endOf('day').toISOString();
      const query = {
        startDate,
        endDate,
      };
      this.props.fetchEntities({ key: 'appointments', join: ['patient'], params: query });
    }
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
      setScheduleDate,
      selectedAppointment,
      selectAppointment,
      services,
      patients,
      chairs,
      weeklySchedules,
      timeOffs,
    } = this.props;

    return (
      <Loader loaded={this.state.loaded} color="#FF715A">
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
        />
      </Loader>
    );
  }
}

ScheduleContainer.propTypes = {
  setAllFilters: PropTypes.func,
  fetchEntities: PropTypes.func,
  setScheduleDate: PropTypes.func,
  practitioners: PropTypes.object,
  currentDate: PropTypes.object,
  appointments: PropTypes.object,
  schedule: PropTypes.object,
  services: PropTypes.object,
  patients: PropTypes.object,
  chairs: PropTypes.object,
};

function mapStateToProps({ entities, schedule }) {

  const practitioners = entities.getIn(['practitioners', 'models']);

  const weeklyScheduleIds = practitioners.toArray().map((practitioner) => {
    if (practitioner.get('isCustomSchedule')) {
      return practitioner.get('weeklyScheduleId');
    }
  });

  const weeklySchedules = entities.getIn(['weeklySchedules', 'models']).filter((schedule) => {
    return weeklyScheduleIds.indexOf(schedule.get('id')) > -1;
  });

  const timeOffs = entities.getIn(['timeOffs', 'models']);

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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setAllFilters,
    setScheduleDate,
    selectAppointment,
}, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ScheduleContainer);
