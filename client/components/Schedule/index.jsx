
import React, { Component, PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './index.css';
import Filters from './Filters';
import styles from './styles.scss';
import 'react-day-picker/lib/style.css';
import Link from '../library/Link';
import setCurrentScheduleDate from '../../thunks/date';
import {
  addPractitionerToFilter,
  selectAppointmentType,
  removePractitionerFromFilter,
} from '../../thunks/schedule';


// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = { availabilities: [], selectedDay: new Date(), showDatePicker: false };
    this.addAvailability = this.addAvailability.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
  }

  componentDidMount() {
    window.socket.on('receiveAvailabilities', (results) => {
      this.setState({ availabilities: results });
    });
    window.socket.on('availabilityAdded', (result) => {
      console.log('availabilityAdded', result);
      const availabilities = this.state.availabilities.concat(result);
      this.setState({ availabilities });
    });
    window.socket.on('availabilityRemoved', (result) => {
      const availabilities = this.state.availabilities.filter(avail => avail.id !== result.id);
      this.setState({ availabilities });
    });
    window.socket.emit('fetchAvailabilities');
    this.props.fetchEntities({ key: 'appointments' });
    this.props.fetchEntities({ key: 'practitioners' });
  }

  handleDayClick(e, day, { selected, disabled }) {
    if (disabled) {
      return;
    }
    if (selected) {
      this.setState({ selectedDay: null, showDatePicker: false });
    } else {
      this.setState({ selectedDay: day, showDatePicker: false });
    }
    const scheduleDate = moment(day);
    this.props.setCurrentScheduleDate(scheduleDate);
  }

  toggleCalendar() {
    this.setState({ showDatePicker: !this.state.showDatePicker });
  }
  
  addAvailability({ start, end }) {
    window.socket.emit('addAvailability', {
      start,
      end,
      title: 'Availability',
    });
  }
  
  removeAvailability({ id }) {
    window.socket.emit('removeAvailability', { id });
  }
  
  render() {
    const events = this.state.availabilities.map((avail) => {
      return Object.assign({}, avail, {
        start: new Date(avail.start),
        end: new Date(avail.end),
      });
    });
    const { showDatePicker } = this.state;
    const {
      practitioners,
      appointments,
      addPractitionerToFilter,
      removePractitionerFromFilter,
      selectAppointmentType,
      schedule,
    } = this.props;
    const appointmentsTypes = [];
    appointments.get('models').toArray()
      .forEach((app) => {
        if (appointmentsTypes.indexOf(app.title) < 0) {
          appointmentsTypes.push(app.title);
        }
      });

    return (
      <div className={styles.scheduleContainerWrapper}>
        <div className={`${styles.scheduleContainer} schedule`}>
          <div className="schedule__title title">
            <Link to="/schedule/monthview">month</Link>
            <br />
            <Link to="/schedule/dayview">day</Link>
            <br />
            <Link to="/schedule/weekview">week</Link>
            <i className="styles__icon___2RuH0 fa fa-calendar"
              onClick={this.toggleCalendar}
            />
            {showDatePicker &&
              <DayPicker
                initialMonth={new Date(2016, 1)}
                selectedDays={day => DateUtils.isSameDay(this.state.selectedDay, day)}
                onDayClick={this.handleDayClick}
              />
            }
          </div>
          {this.props.children}
        </div>
        <div className={styles.scheduleSidebar}>
          <Filters
            practitioners={practitioners.get('models').toArray()}
            addPractitionerToFilter={addPractitionerToFilter}
            removePractitionerFromFilter={removePractitionerFromFilter}
            schedule={schedule}
            appointmentsTypes={appointmentsTypes}
            selectAppointmentType={selectAppointmentType}
          />
        </div>
      </div>
    );
  }
}

Schedule.propTypes = {
  fetchEntities: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.object),
  practitioners: PropTypes.object,
  patients: PropTypes.object,
  appointments: PropTypes.object,
  addPractitionerToFilter: PropTypes.func,
  removePractitionerFromFilter: PropTypes.func,
  selectAppointmentType: PropTypes.func,
  schedule: PropTypes.object,
};

function mapStateToProps({ entities, schedule }) {
  return {
    practitioners: entities.get('practitioners'),
    schedule,
    appointments: entities.get('appointments'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setCurrentScheduleDate,
    addPractitionerToFilter,
    removePractitionerFromFilter,
    selectAppointmentType,
  }, dispatch);
}
const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Schedule);
