
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import {
  Grid,
  Row,
  Col,
  Card,
  DayPicker,
  Modal,
} from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import AddNewAppointment from './AddNewAppointment';
import CurrentDate from './Cards/CurrentDate';
import Legend from './Cards/Legend';
import HeaderButtons from './Cards/HeaderButtons';
import Filters from './Cards/Filters';
import styles from './styles.scss';

class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewAppointment: false,
      selectedAppointment: null,
    };

    this.setCurrentDay = this.setCurrentDay.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.selectAppointment = this.selectAppointment.bind(this);
  }

  setCurrentDay(day) {
    this.props.setScheduleDate({ scheduleDate: moment(day) });
  }

  reinitializeState() {
    this.setState({
      addNewAppointment: false,
      selectedAppointment: null,
    });
  }

  addNewAppointment() {
    this.setState({
      addNewAppointment: true,
    });
  }

  selectAppointment(app) {
    this.setState({
      selectedAppointment: app,
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

    const {
      addNewAppointment,
      selectedAppointment,
    } = this.state;

    const currentDate = moment(schedule.toJS().scheduleDate);

    const params = {
      currentDate,
      practitioners,
      patients,
      chairs,
      services,
      appointments,
      schedule,
      selectAppointment: this.selectAppointment,
    };

    let formName = 'NewAppointmentForm';
    if (selectedAppointment) {
      const app = selectedAppointment.appointment;
      formName = `EditAppointment_${app.id}`;
    }

    return (
      <Grid >
        <Row className={styles.rowMainContainer}>
          <Col xs={12} sm={8} md={8} className={styles.schedule__container}>
            <Card>
              <div className={`${styles.schedule__title} ${styles.title}`}>
                <CurrentDate currentDate={currentDate}>
                  <DayPicker
                    target="icon"
                    onChange={this.setCurrentDay}
                    multiple={false}
                  />
                  <HeaderButtons
                    addNewAppointment={this.addNewAppointment}
                  />
                </CurrentDate>
              </div>
              <div className={styles.schedule__container_content}>
                <DayView {...params} />
                <Legend />
                <Modal
                  active={addNewAppointment || !!selectedAppointment}
                  onEscKeyDown={this.reinitializeState}
                  onOverlayClick={this.reinitializeState}
                  custom
                >
                  <AddNewAppointment
                    formName={formName}
                    chairs={chairs.get('models').toArray()}
                    practitioners={practitioners.get('models')}
                    services={services.get('models')}
                    patients={patients.get('models').toArray()}
                    selectedAppointment={selectedAppointment}
                    reinitializeState={this.reinitializeState}
                  />
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
                  practitioners={practitioners.get('models')}
                  services={services.get('models')}
                />
              </Col>
            </Row>
            <Row className={styles.schedule__sidebar_rowRequest}>
              <Col xs={12}>
                <RequestsContainer
                  className={styles.schedule__sidebar_request}
                />
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
