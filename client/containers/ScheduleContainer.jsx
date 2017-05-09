
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
    // TODO: this.props.date will add query to appointments
    Promise.all([
      this.props.fetchEntities({ key: 'practitioners'}),
      this.props.fetchEntities({ key: 'services' }),
      this.props.fetchEntities({ key: 'chairs' }),
      this.props.fetchEntities({ key: 'appointments' }),
      this.props.fetchEntities({ key: 'patients' }),
    ]).then(() => {
      this.props.setAllFilters(['chairs', 'practitioners', 'services']);
      this.setState({ loaded: true });
    }).catch(e => console.log(e));
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.date !== this.props.date) this.
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
      date,
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
};

function mapStateToProps({ entities, schedule }) {
  return {
    practitioners: entities.get('practitioners'),
    schedule,
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
