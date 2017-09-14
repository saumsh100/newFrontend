
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
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
import AddPatientUser from './AddPatientUser';
import AddPatientSuggestions from './AddPatientSuggestions';
import CurrentDate from './Cards/CurrentDate';
import Legend from './Cards/Legend';
import HeaderButtons from './Cards/HeaderButtons';
import Filters from './Cards/Filters';
import styles from './styles.scss';
import Calendar from "../library/Calendar/index";

class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewAppointment: false,
      patientSearched: null,
    };
    this.setCurrentDay = this.setCurrentDay.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.setPatientSearched = this.setPatientSearched.bind(this);
  }

  setCurrentDay(day) {
    this.props.setScheduleDate({ scheduleDate: moment(day) });
  }

  reinitializeState() {
    this.props.setMergingPatient({
      patientUser: null,
      requestData: null,
      suggestions: [],
    });
    this.props.selectAppointment(null);
    this.setState({
      addNewAppointment: false,
      patientSearched: null,
    });
  }

  addNewAppointment() {
    this.setState({
      addNewAppointment: true,
    });
  }

  setPatientSearched(patientSearched) {
    this.setState({
      patientSearched,
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
      selectAppointment,
      selectedAppointment,
      setMergingPatient,
      weeklySchedules,
      timeOffs,
    } = this.props;

    const {
      addNewAppointment,
    } = this.state;

    const currentDate = moment(schedule.toJS().scheduleDate);

    let formName = 'NewAppointmentForm';
    if (selectedAppointment) {
      formName = `editAppointment_${selectedAppointment.serviceId}`;
    }

    const mergingPatientData = schedule.toJS().mergingPatientData;

    const filterPractitioners = practitioners.get('models').filter(prac => prac.get('isActive'));

    let displayModalComponent = (
      <AddNewAppointment
        formName={formName}
        chairs={chairs.get('models').toArray()}
        practitioners={filterPractitioners}
        services={services.get('models')}
        patients={patients.get('models')}
        selectedAppointment={selectedAppointment}
        reinitializeState={this.reinitializeState}
        weeklySchedules={weeklySchedules}
        setPatientSearched={this.setPatientSearched}
        patientSearched={this.state.patientSearched}
      />
    );

    if (mergingPatientData.patientUser && mergingPatientData.suggestions.length > 0) {
      displayModalComponent = (
        <AddPatientSuggestions
          mergingPatientData={mergingPatientData}
          reinitializeState={this.reinitializeState}
          selectAppointment={selectAppointment}
          setMergingPatient={setMergingPatient}
        />
      );
    } else if (mergingPatientData.patientUser) {
      displayModalComponent = (
        <AddPatientUser
          mergingPatientData={mergingPatientData}
          reinitializeState={this.reinitializeState}
          selectAppointment={selectAppointment}
        />
      );
    }

    return (
      <DocumentTitle title="CareCru | Schedule">
        <Grid>
          <Row className={styles.rowMainContainer}>
            <Col xs={12} sm={9} md={9} className={styles.schedule__container}>
              <Card>
                <div className={`${styles.schedule__title} ${styles.title}`}>
                  <CurrentDate currentDate={currentDate}>
                    <DayPicker
                      target="icon"
                      selectedDays={new Date(currentDate)}
                      onDayClick={this.setCurrentDay}
                      multiple={false}
                      data-test-id="dayPicker"
                    />
                    <HeaderButtons
                      addNewAppointment={this.addNewAppointment}
                    />
                  </CurrentDate>
                </div>
                <div className={styles.schedule__container_content}>
                  <DayView
                    currentDate={currentDate}
                    practitioners={filterPractitioners}
                    patients={patients}
                    chairs={chairs}
                    services={services}
                    appointments={appointments}
                    schedule={schedule}
                    selectAppointment={selectAppointment}
                  />
                  <Modal
                    active={
                      addNewAppointment ||
                      !!selectedAppointment ||
                      !!mergingPatientData.patientUser
                    }
                    onEscKeyDown={this.reinitializeState}
                    onOverlayClick={this.reinitializeState}
                    custom
                  >
                    {displayModalComponent}
                  </Modal>
                </div>
                {/* Here is the legend */}
                <Legend />
              </Card>
            </Col>
            <Col xs={12} sm={3} md={3} className={styles.schedule__sidebar}>
              <Row className={styles.schedule__sidebar_rowCalendar}>
                <Col xs={12}>
                  <Calendar
                    selectedDays={new Date(currentDate)}
                    onDayClick={this.setCurrentDay}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Filters
                    schedule={schedule}
                    chairs={chairs.get('models').toArray()}
                    practitioners={filterPractitioners}
                    services={services.get('models')}
                  />
                </Col>
              </Row>
              <Row className={styles.schedule__sidebar_rowRequest}>
                <Col xs={12} className={styles.schedule__sidebar_request} >
                  <RequestsContainer
                    key={'scheduleRequests'}
                    maxHeight="calc(100vh - 740px)"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </DocumentTitle>
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
  selectAppointment: PropTypes.func,
  selectedAppointment: PropTypes.object,
};

export default ScheduleComponent;
