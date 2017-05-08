
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities } from '../thunks/fetchEntities';
import setCurrentScheduleDate from '../thunks/date';

import {
  addPractitionerToFilter,
  selectAppointmentType,
  removePractitionerFromFilter,
  setAllFilters,
} from '../thunks/schedule';


class ScheduleContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentWillMount() {
    Promise.all([
      this.props.fetchEntities({ key: 'practitioners'}),
      this.props.fetchEntities({ key: 'services' }),
      this.props.fetchEntities({ key: 'chairs' }),
      this.props.fetchEntities({ key: 'appointments' }),
      this.props.fetchEntities({ key: 'patients' }),
      this.props.fetchEntities({ key: 'requests' }),

    ]).then(() => {
      this.props.setAllFilters();
      this.setState({ loaded: true })
    }).catch(e => console.log(e))
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
      addPractitionerToFilter,
      removePractitionerFromFilter,
      selectAppointmentType,
      setCurrentScheduleDate,
      requests,
      services,
      patients,
      chairs,
      date,
    } = this.props;

    let loadComponent = null;

    if (this.state.loaded) {
      loadComponent = (
        <ScheduleComponent
          practitioners={practitioners}
          schedule={schedule}
          appointments={appointments}
          addPractitionerToFilter={addPractitionerToFilter}
          removePractitionerFromFilter={removePractitionerFromFilter}
          selectAppointmentType={selectAppointmentType}
          fetchEntities={selectAppointmentType}
          setCurrentScheduleDate={setCurrentScheduleDate}
          requests={requests}
          services={services}
          patients={patients}
          chairs={chairs}
          date={date}
        />
      )
    }

    return (
      <div>
        {loadComponent}
      </div>
    );
  }
}

ScheduleContainer.propTypes = {
  fetchEntities: PropTypes.func,
  setSheduleMode: PropTypes.func,
  setCurrentScheduleDate: PropTypes.func,
  addPractitionerToFilter: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
};

function mapStateToProps({ entities, schedule, date }) {
  return {
    practitioners: entities.get('practitioners'),
    schedule,
    date,
    appointments: entities.get('appointments'),
    requests: entities.get('requests'),
    patients: entities.get('patients'),
    services: entities.get('services'),
    chairs: entities.get('chairs'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addPractitionerToFilter,
    removePractitionerFromFilter,
    selectAppointmentType,
    fetchEntities,
    setAllFilters,
    setCurrentScheduleDate,
}, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ScheduleContainer);
