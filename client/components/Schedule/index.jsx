
import React, { Component, PropTypes } from 'react';
import { Card } from '../library';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import styles from './styles.scss';
import Link from '../library/Link';
import DayPicker, { DateUtils } from "react-day-picker";
import setCurrentScheduleDate from '../../thunks/date';
import "react-day-picker/lib/style.css";
import './index.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
  
class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = { availabilities: [], selectedDay: new Date(), showDatePicker: false };
    this.addAvailability = this.addAvailability.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
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
    return (
      <div className={`${styles.scheduleContainer} schedule`}>
        <div className="schedule__title title">
          <Link to="/schedule/monthview">month</Link>
          <br/>
          <Link to="/schedule/dayview">day</Link>
          <br/>         
          <Link to="/schedule/weekview">week</Link>
        
        <i className="styles__icon___2RuH0 fa fa-calendar"
          onClick={this.toggleCalendar}>
        </i>
        {showDatePicker && 
          <DayPicker
            initialMonth={ new Date(2016, 1) }
            selectedDays={ day => DateUtils.isSameDay(this.state.selectedDay, day) }
            onDayClick={ this.handleDayClick.bind(this) }
          />
        }
        </div>
        {this.props.children}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentScheduleDate,
    }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(Schedule);



