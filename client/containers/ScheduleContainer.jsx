
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, RouterButton } from '../components/library';
import styles from '../components/Patients/styles.scss';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities } from '../thunks/fetchEntities';
import setCurrentScheduleDate from '../thunks/date';
import {
  addPractitionerToFilter,
  selectAppointmentType,
  removePractitionerFromFilter,
  setSheduleMode,
} from '../thunks/schedule';

class ScheduleContainer extends React.Component {
  componentWillMount() {
    this.props.fetchEntities({ key: 'patients' });
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'appointments' });
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.fetchEntities({ key: 'requests' });
    
  }

  render() {
    const {
      practitioners,
      schedule,
      appointments,
      setCurrentScheduleDate,
      addPractitionerToFilter,
      removePractitionerFromFilter,
      selectAppointmentType,
      fetchEntities,
      setSheduleMode,
      requests,
    } = this.props;  
    return (
      <ScheduleComponent
        practitioners={practitioners}
        schedule={schedule}
        appointments={appointments}
        setCurrentScheduleDate={setCurrentScheduleDate}
        addPractitionerToFilter={addPractitionerToFilter}
        removePractitionerFromFilter={removePractitionerFromFilter}
        selectAppointmentType={selectAppointmentType}
        fetchEntities={selectAppointmentType}
        setSheduleMode={setSheduleMode}
        requests={requests}
      />
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

function mapStateToProps({ entities, schedule }) {
  return { 
    practitioners: entities.get('practitioners'),
    schedule,
    appointments: entities.get('appointments'),
    requests: entities.get('requests')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentScheduleDate,
    addPractitionerToFilter,
    removePractitionerFromFilter,
    selectAppointmentType,
    fetchEntities,
    setSheduleMode,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ScheduleContainer);
