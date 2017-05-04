
import React, { Component, PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import { Grid, Row, Col, Card, Icon, Calendar, Tabs, Tab } from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import Filters from './Cards/Filters';
import HeaderButtons from './Cards/HeaderButtons'
import DayView from './DayView';
import MonthView from './MonthView';
import WeekView from './WeekView';
import CurrentDate from './Cards/CurrentDate';
import CurrentDateCalendar from './Cards/CurrentDate/CurrentDateCalendar';
import styles from './styles.scss';

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
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentDidMount() {
    window.socket.on('receiveAvailabilities', (results) => {
      this.setState({availabilities: results});
    });
    window.socket.on('availabilityAdded', (result) => {
      console.log('availabilityAdded', result);
      const availabilities = this.state.availabilities.concat(result);
      this.setState({availabilities});
    });
    window.socket.on('availabilityRemoved', (result) => {
      const availabilities = this.state.availabilities.filter(avail => avail.id !== result.id);
      this.setState({availabilities});
    });
    window.socket.emit('fetchAvailabilities');
  }


  toggleCalendar() {
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  addAvailability({start, end}) {
    window.socket.emit('addAvailability', {
      start,
      end,
      title: 'Availability',
    });
  }

  removeAvailability({id}) {
    window.socket.emit('removeAvailability', {id});
  }

  handleTabChange(index) {
    this.props.setSheduleMode(index);
    this.setState({index});
  }

  render() {
    const events = this.state.availabilities.map((avail) => {
      return Object.assign({}, avail, {
        start: new Date(avail.start),
        end: new Date(avail.end),
      });
    });
    const {showDatePicker} = this.state;
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
    };
    const currentDate = moment(schedule.toJS().scheduleDate);
    switch (this.state.index) {
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
        <Row className={styles.rowTest}>
          <Col xs={12} sm={8} md={9}className={styles.schedule__container}>
            <Card>
              <div className={`${styles.schedule__title} ${styles.title}`}>
                <CurrentDate currentDate={currentDate}>
                  <Icon icon="calendar"
                        onClick={this.toggleCalendar}
                        className={styles.title__icon}
                  />
                  <HeaderButtons />
                </CurrentDate>
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
                  <Calendar
                    className={styles.schedule__daypicker_select}
                  />
                </div>
                }
              </div>
              <div className={styles.schedule__container_content}>
                <CurrentDateCalendar currentDate={currentDate} />
                {content}
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={4} md={3} className={styles.schedule__sidebar}>
            <Row >
              <Col xs={12}>
                <Filters
                  practitioners={practitioners.get('models').toArray()}
                  addPractitionerToFilter={addPractitionerToFilter}
                  removePractitionerFromFilter={removePractitionerFromFilter}
                  schedule={schedule}
                  appointmentsTypes={appointmentsTypes}
                  selectAppointmentType={selectAppointmentType}
                  services={services.get('models').toArray()}
                />
              </Col>
            </Row>
            <Row className={styles.schedule__sidebar_rowRequest}>
              <Col xs={12}>
                <RequestsContainer className={styles.schedule__sidebar_request} />
              </Col>
            </Row>
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
