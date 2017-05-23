
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ScheduleComponent from '../components/Schedule';
import { fetchEntities } from '../thunks/fetchEntities';
import { setScheduleDate } from '../actions/schedule';

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
    const {
      currentDate,
    } = this.props;

    const startDate = currentDate.startOf('day').toISOString();
    const endDate = currentDate.endOf('day').toISOString();

    const query = {
      startDate,
      endDate,
    };

    Promise.all([
      this.props.fetchEntities({ key: 'appointments', join: ['patient'], params: query }),
      this.props.fetchEntities({ key: 'practitioners'}),
      this.props.fetchEntities({ key: 'services' }),
      this.props.fetchEntities({ key: 'chairs' }),
    ]).then(() => {
      this.props.setAllFilters(['chairs', 'practitioners', 'services']);
      this.setState({ loaded: true });
    }).catch(e => console.log(e));
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentDate,
    } = this.props;

    const nextPropsDate = nextProps.schedule.toJS().scheduleDate;

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
      services,
      patients,
      chairs,
    } = this.props;

    let loadComponent = null;

    if (this.state.loaded) {
      loadComponent = (
        <ScheduleComponent
          practitioners={practitioners}
          schedule={schedule}
          appointments={appointments}
          setScheduleDate={setScheduleDate}
          services={services}
          patients={patients}
          chairs={chairs}
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
  return {
    schedule,
    currentDate: schedule.toJS().scheduleDate,
    practitioners: entities.get('practitioners'),
    appointments: entities.get('appointments'),
    patients: entities.get('patients'),
    services: entities.get('services'),
    chairs: entities.get('chairs'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setAllFilters,
    setScheduleDate,
}, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ScheduleContainer);
