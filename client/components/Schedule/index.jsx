
import React, { Component, PropTypes } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { Grid, Row, Col, Card, DayPicker, Modal, RangeSlider } from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import AddNewAppointment from './AddNewAppointment';
import TestDayView from './DayView/TestDayView';

import CurrentDate from './Cards/CurrentDate';
import CurrentDateCalendar from './Cards/CurrentDate/CurrentDateCalendar';
import HeaderButtons from './Cards/HeaderButtons';
import Filters from './Cards/Filters';
import styles from './styles.scss';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewAppointment: false,
    };

    this.handleDayPicker = this.handleDayPicker.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
  }

  handleDayPicker(day) {
    this.props.setScheduleDate({ scheduleDate: moment(day) });
  }

  reinitializeState() {
    this.setState({
      addNewAppointment: !this.state.addNewAppointment,
    });
  }

  render() {
    const {
      practitioners,
      appointments,
      schedule,
      patients,
      services,
      chairs,
    } = this.props;

    const currentDate = moment(schedule.toJS().scheduleDate);

    const params = {
      practitioners,
      patients,
      appointments,
      schedule,
      currentDate,
    };

    return (
      <Grid className={styles.schedule}>
        <Row className={styles.rowTest}>
          <Col xs={12} sm={8} md={8} className={styles.schedule__container}>
            <Card>
              <div className={`${styles.schedule__title} ${styles.title}`}>
                <CurrentDate currentDate={currentDate}>
                  <DayPicker
                    target="icon"
                    onChange={this.handleDayPicker}
                  />
                  <HeaderButtons
                    reinitializeState={this.reinitializeState}
                  />
                </CurrentDate>
              </div>
              <div className={styles.schedule__container_content}>
                <CurrentDateCalendar currentDate={currentDate} />
                <DayView {...params} />
                <Modal
                  active={this.state.addNewAppointment}
                  onEscKeyDown={this.reinitializeState}
                  onOverlayClick={this.reinitializeState}
                  custom
                >
                  <AddNewAppointment {...params} />
                </Modal>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={4} md={4} className={styles.schedule__sidebar}>
            <Row>
              <Col xs={12}>
                <Filters
                  schedule={schedule}
                  chairs={chairs.get('models').toArray()}
                  practitioners={practitioners.get('models').toArray()}
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
  children: PropTypes.arrayOf(PropTypes.object),
  practitioners: PropTypes.object,
  patients: PropTypes.object,
  appointments: PropTypes.object,
  schedule: PropTypes.object,
  chairs: PropTypes.object,
  services: PropTypes.object,
  setScheduleDate: PropTypes.func,
};

export default ScheduleComponent;
