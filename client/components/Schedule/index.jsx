
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import {
  Grid,
  Row,
  Col,
  Card,
  SHeader,
  SBody,
  SContainer,
  Button,
  DayPicker,
  IconButton,
  Modal,
  DialogBox,
} from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import AddNewAppointment from './AddNewAppointment';
import AddPatientUser from './AddPatientUser';
import AddPatientSuggestions from './AddPatientSuggestions';
import CurrentDate from './Cards/CurrentDate';
import Legend from './Cards/Legend';
import HeaderButtons from './Cards/HeaderButtons';
import Calendar from '../library/Calendar/index';
import ConfirmAppointmentRequest from './ConfirmAppointmentRequest/index';
import styles from './styles.scss';


class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewAppointment: false,
      patientSearched: null,
      sendEmail: false,
    };
    this.setCurrentDay = this.setCurrentDay.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.setPatientSearched = this.setPatientSearched.bind(this);
    this.setSendEmail = this.setSendEmail.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.previousDay = this.previousDay.bind(this);
  }

  setCurrentDay(day) {
    this.props.setScheduleDate({ scheduleDate: moment(day) });
  }

  nextDay(currentDay) {
    this.props.setScheduleDate({ scheduleDate: moment(currentDay).add(1, 'days') });
  }

  previousDay(currentDay) {
    this.props.setScheduleDate({ scheduleDate: moment(currentDay).subtract(1, 'days') });
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
      sendEmail: false,
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

  setSendEmail() {
    this.setState({
      sendEmail: !this.state.sendEmail,
    })
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
      unit,
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
    const filterChairs = chairs.get('models').filter(chair => chair.get('isActive'));

    let displayModalComponent = selectedAppointment && selectedAppointment.nextAppt ? (
      <ConfirmAppointmentRequest
        patients={patients.get('models')}
        selectedAppointment={selectedAppointment}
        selectAppointment={selectAppointment}
        reinitializeState={this.reinitializeState}
        setCurrentDay={this.setCurrentDay}
        setSendEmail={this.setSendEmail}
        sendEmail={this.state.sendEmail}
      />
    ) : null;

    let displayTitle = this.state.sendEmail ? 'Send Confirmation Email?' : 'Could this be the same appointment?';

    if (mergingPatientData.patientUser && mergingPatientData.suggestions.length > 0) {
      displayTitle = 'Create or Connect a Patient';
      displayModalComponent = (
        <AddPatientSuggestions
          mergingPatientData={mergingPatientData}
          reinitializeState={this.reinitializeState}
          selectAppointment={selectAppointment}
          setMergingPatient={setMergingPatient}
        />
      );
    } else if (mergingPatientData.patientUser) {
      displayTitle = 'Add New Patient';
      displayModalComponent = (
        <AddPatientUser
          mergingPatientData={mergingPatientData}
          reinitializeState={this.reinitializeState}
          selectAppointment={selectAppointment}
        />
      );
    }

    const leftColumnWidth = 70;

    return (
      <DocumentTitle title="CareCru | Schedule">
        <Grid>
          <Row className={styles.rowMainContainer}>
            <Col xs={12} sm={9} md={9} >
              <Card className={styles.card}>
                <SContainer>
                <SHeader className={`${styles.schedule__title} ${styles.title}`}>
                  <CurrentDate currentDate={currentDate} leftColumnWidth={leftColumnWidth}>
                    <div className={styles.changeDay}>
                      <IconButton
                        icon="angle-left"
                        size={1.3}
                        onClick={() => this.previousDay(currentDate)}
                        className={styles.changeDay_left}
                      />
                      <IconButton
                        icon="angle-right"
                        size={1.3}
                        onClick={() => this.nextDay(currentDate)}
                        className={styles.changeDay_right}
                      />
                    </div>

                    <Button
                      border="blue"
                      onClick={() => this.setCurrentDay(new Date())}
                      className={styles.headerButtons_buttonText}
                    >
                      Today
                    </Button>

                    <HeaderButtons
                      addNewAppointment={this.addNewAppointment}
                      schedule={schedule}
                      chairs={filterChairs}
                      practitioners={filterPractitioners}
                      services={services.get('models')}
                    />
                  </CurrentDate>
                </SHeader>
                <SBody className={styles.schedule__container_content} >
                  <DayView
                    currentDate={currentDate}
                    practitioners={filterPractitioners}
                    patients={patients}
                    chairs={chairs}
                    services={services}
                    appointments={appointments}
                    schedule={schedule}
                    selectAppointment={selectAppointment}
                    leftColumnWidth={leftColumnWidth}
                  />
                  <Modal
                    active={
                      (addNewAppointment ||
                        (!!selectedAppointment && !selectedAppointment.nextAppt))
                    }
                    onEscKeyDown={this.reinitializeState}
                    onOverlayClick={this.reinitializeState}
                    custom
                  >
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
                      unit={unit}
                    />
                  </Modal>
                  <DialogBox
                    title={displayTitle}
                    type="medium"
                    active={((selectedAppointment && selectedAppointment.nextAppt) ||
                      !!mergingPatientData.patientUser)}
                    onEscKeyDown={this.reinitializeState}
                    onOverlayClick={this.reinitializeState}
                  >
                    {displayModalComponent}
                  </DialogBox>
                </SBody>
                </SContainer>
              </Card>
        </Col>
            <Col xs={12} sm={3} md={3} className={styles.schedule__sidebar}>
              <Row className={styles.schedule__sidebar_rowCalendar}>
                <Col xs={12}>
                  <Card>
                    <Calendar
                      month={new Date(moment(currentDate).year(), moment(currentDate).month())}
                      selectedDays={new Date(currentDate)}
                      onDayClick={this.setCurrentDay}
                    />
                  </Card>
                </Col>
              </Row>
              <Row className={styles.schedule__sidebar_rowRequest}>
                <Col xs={12} className={styles.schedule__sidebar_request} >
                  <RequestsContainer
                    key={'scheduleRequests'}
                    maxHeight="250px"
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
  setMergingPatient: PropTypes.func,
  weeklySchedules: PropTypes.object,
  unit: PropTypes.number,
};

export default ScheduleComponent;
