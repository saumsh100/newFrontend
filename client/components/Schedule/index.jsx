
import React, { Component, PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import Link from '../library/Link';
import setCurrentScheduleDate from '../../thunks/date';
import { fetchEntities } from '../../thunks/fetchEntities';
import {
  addPractitionerToFilter,
  selectAppointmentType,
  removePractitionerFromFilter,
} from '../../thunks/schedule';
import DayPicker, { DateUtils } from 'react-day-picker';
import DayPickerStyles from "../library/DayPicker/styles.css";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Filters from './Filters'
import styles from './styles.scss';
import { Grid, Row, Col, Card, Tabs, Tab } from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import CurrentDate from './CurrentDate';
// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availabilities: [],
      selectedDay: new Date(),
      showDatePicker: false,
      index: 0,
    };
    this.addAvailability = this.addAvailability.bind(this);
    this.removeAvailability = this.removeAvailability.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
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

  handleTabChange(index) {
    this.props.setSheduleMode(index);
    this.setState({ index });
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
      patients,
      requests,
      services,
    } = this.props;
    const appointmentsTypes = [];
    appointments.get('models').toArray()
      .forEach((app) => {
        if (appointmentsTypes.indexOf(app.title) < 0) {
          appointmentsTypes.push(app.title);
        }
      });
    let content = null;
    const params = {
      practitioners,
      patients,
      appointments,
      schedule,
    }
    const currentDate = moment(schedule.toJS().scheduleDate);
    switch(this.state.index) {
      case 0:
        content = <DayView {...params} />;
        break;
      case 1:
        content = <MonthView {...params} />;
        break;
      case 2:
        content = <WeekView {...params} />;
        break;
    }
    return (
      <Grid className={styles.schedule}>
        <Row>
          <Col xs={9} className={styles.schedule__container}>
            <Card>
              <div className={`${styles.schedule__title} ${styles.title}`}>
                <CurrentDate currentDate={currentDate} />
                <i className="fa fa-calendar"
                   onClick={this.toggleCalendar}
                />
                <Tabs index={this.state.index} onChange={this.handleTabChange}>
                  {schedule.toJS().scheduleModes.map(s => {
                    const label = s;
                    return (
                      <Tab label={label}>
                        {/* <span>{label}</span> */}
                      </Tab>
                    )
                  })}
                </Tabs>
                {this.state.showDatePicker &&
                <div className={styles.schedule__daypicker}>
                  <div onClick={this.toggleCalendar} className={styles.schedule__daypicker_wrapper}>
                  </div>
                  <DayPicker
                    className={styles.schedule__daypicker_select}
                    initialMonth={new Date(2016, 1)}
                    styles={`${styles.calendar}${DayPickerStyles}`}
                    selectedDays={day => DateUtils.isSameDay(this.state.selectedDay, day)}
                    onDayClick={this.handleDayClick}
                  />
                </div>
                }
              </div>
              {content}
            </Card>
          </Col>
          <Col xs={3} className={styles.schedule__sidebar}>
            <Filters
              practitioners={practitioners.get('models').toArray()}
              addPractitionerToFilter={addPractitionerToFilter}
              removePractitionerFromFilter={removePractitionerFromFilter}
              schedule={schedule}
              appointmentsTypes={appointmentsTypes}
              selectAppointmentType={selectAppointmentType}
            />
            <RequestsContainer className={styles.schedule__sidebar_request}/>
            <DayPicker
              className={styles.schedule__sidebar_calendar}
              styles={DayPickerStyles}
              initialMonth={new Date(2016, 1)}
              selectedDays={day => DateUtils.isSameDay(this.state.selectedDay, day)}
              onDayClick={this.handleDayClick}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

ScheduleComponent.propTypes = {
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

export default ScheduleComponent;
