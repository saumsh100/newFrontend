
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  SBody,
  SContainer,
  Button,
  Modal,
  DialogBox,
  DayPicker,
} from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import AddNewAppointment from './AddNewAppointment';
import AddPatient from './AddPatient';
import AddPatientSuggestions from './AddPatientSuggestions';
import Header from './Header';
import RemoteSubmitButton from '../library/Form/RemoteSubmitButton';
import ConfirmAppointmentRequest from './ConfirmAppointmentRequest/index';
import styles from './styles.scss';

class ScheduleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewAppointment: false,
      patientSearched: null,
      sendEmail: false,
      showInput: false,
    };
    this.setCurrentDay = this.setCurrentDay.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.setPatientSearched = this.setPatientSearched.bind(this);
    this.setSendEmail = this.setSendEmail.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.previousDay = this.previousDay.bind(this);
    this.setShowInput = this.setShowInput.bind(this);
    this.handlePatientUserSubmit = this.handlePatientUserSubmit.bind(this);
    this.handlePatientSubmit = this.handlePatientSubmit.bind(this);
    this.setCreatingPatient = this.setCreatingPatient.bind(this);
  }

  handlePatientUserSubmit(values) {
    const {
      schedule,
      selectAppointment,
      createEntityRequest,
    } = this.props;

    const mergingPatientData = schedule.toJS().mergingPatientData;

    const {
      requestData,
      patientUser,
    } = mergingPatientData;

    values.isSyncedWithPms = false;
    values.patientUserId = patientUser.id;

    const appointment = {
      startDate: requestData.startDate,
      endDate: requestData.endDate,
      serviceId: requestData.serviceId,
      note: requestData.note,
      isSyncedWithPms: false,
      customBufferTime: 0,
      requestModel: requestData.requestModel,
      request: true,
      practitionerId: requestData.practitionerId,
    };

    const alert = {
      success: {
        body: 'New Patient Added.',
      },
      error: {
        body: 'Failed to add patient.',
      },
    };

    createEntityRequest({
      key: 'patients',
      entityData: values,
      alert,
    }).then((result) => {
      appointment.patientId = Object.keys(result.patients)[0];
      this.reinitializeState();
      selectAppointment(appointment);
    });
  }

  handlePatientSubmit(values) {
    const alert = {
      success: {
        body: 'New Patient Added.',
      },
      error: {
        body: 'Failed to add patient.',
      },
    };

    this.props.createEntityRequest({
      key: 'patients',
      entityData: values,
      alert,
    }).then(() => {
      this.props.setCreatingPatient({ createPatientBool: false });
    });
  }

  setCreatingPatient(value = false) {
    this.props.setCreatingPatient({ creatingPatientBool: value });
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
    this.props.setCreatingPatient(false);
    this.props.selectAppointment(null);
    this.setState({
      addNewAppointment: false,
      patientSearched: null,
      sendEmail: false,
      showInput: false,
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
    });
  }

  setShowInput(showBool) {
    this.setState({
      showInput: showBool,
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
      unit,
      appsFetched,
      pracsFetched,
      chairsFetched,
      accountsFetched,
    } = this.props;

    const {
      addNewAppointment,
    } = this.state;


    let formName = 'NewAppointmentForm';
    if (selectedAppointment) {
      formName = `editAppointment_${selectedAppointment.serviceId}`;
    }

    const mergingPatientData = schedule.toJS().mergingPatientData;
    const createNewPatient = schedule.toJS().createNewPatient;
    const leftColumnWidth = schedule.toJS().leftColumnWidth;
    const currentDate = moment(schedule.toJS().scheduleDate);

    const filterPractitioners = practitioners.get('models').filter(prac => prac.get('isActive'));
    const filterChairs = chairs.get('models').filter(chair => chair.get('isActive'));

    let displayTitle = this.state.sendEmail ? 'Send Confirmation Email?' : 'Could this be the same appointment?';

    let displayModalComponent = null;

    let actions = [];

    if (selectedAppointment && selectedAppointment.nextAppt) {
      displayModalComponent = (
        <ConfirmAppointmentRequest
          patients={patients.get('models')}
          selectedAppointment={selectedAppointment}
          selectAppointment={selectAppointment}
          reinitializeState={this.reinitializeState}
          setCurrentDay={this.setCurrentDay}
          setSendEmail={this.setSendEmail}
          sendEmail={this.state.sendEmail}
        />
      );
    }

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

      const patientFormName = 'Create New Patient User';

      actions = [
        { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { border: 'blue' } },
        { label: 'Save', onClick: this.handlePatientUserSubmit, component: RemoteSubmitButton, props: { color: 'blue', form: patientFormName } },
      ];

      displayModalComponent = (
        <AddPatient
          mergingPatientData={mergingPatientData}
          formName={patientFormName}
          onSubmit={this.handlePatientUserSubmit}
        />
      );
    }

    if (createNewPatient) {
      displayTitle = 'Create New Patient';
      const patientFormName = 'Create New Patient';

      actions = [
        { label: 'Cancel',
          onClick: () => {
            this.setCreatingPatient(false);
          },
          component: Button,
          props: { border: 'blue' },
        },
        { label: 'Save',
          onClick: this.handlePatientSubmit,
          component: RemoteSubmitButton,
          props: { color: 'blue', form: patientFormName },
        },
      ];

      displayModalComponent = (
        <AddPatient
          formName={patientFormName}
          onSubmit={this.handlePatientSubmit}
        />
      );
    }

    const allFetched = appsFetched && accountsFetched && chairsFetched && pracsFetched;

    return (
      <div className={styles.rowMainContainer}>
          <div className={styles.dayViewContainer}>
            <Card
              className={styles.card}
              runAnimation
              loaded={allFetched}
            >
              <SContainer>
                <Header
                  addNewAppointment={this.addNewAppointment}
                  schedule={schedule}
                  chairs={filterChairs}
                  practitioners={filterPractitioners}
                  previousDay={this.previousDay}
                  setCurrentDay={this.setCurrentDay}
                  nextDay={this.nextDay}
                  reinitializeState={this.reinitializeState}
                />
                <SBody>
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
                  {allFetched ? (
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
                        chairs={filterChairs}
                        practitioners={filterPractitioners}
                        patients={patients.get('models')}
                        reinitializeState={this.reinitializeState}
                        weeklySchedules={weeklySchedules}
                        setPatientSearched={this.setPatientSearched}
                        patientSearched={this.state.patientSearched}
                        unit={unit.get('unit')}
                        currentDate={currentDate}
                        showInput={this.state.showInput}
                        setShowInput={this.setShowInput}
                        selectedAppointment={this.props.selectedAppointment}
                        setCreatingPatient={this.props.setCreatingPatient}
                      />
                    </Modal>) : null }
                  {allFetched ?
                    (<DialogBox
                      title={displayTitle}
                      type={createNewPatient ? 'small' : 'medium'}
                      actions={actions}
                      active={((selectedAppointment && selectedAppointment.nextAppt) ||
                        !!mergingPatientData.patientUser) || createNewPatient}
                      onEscKeyDown={this.reinitializeState}
                      onOverlayClick={
                        createNewPatient ? this.setCreatingPatient : this.reinitializeState
                      }
                    >

                      {displayModalComponent}
                    </DialogBox>) : null}
                </SBody>
              </SContainer>
            </Card>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.sidebar_rowCalendar}>
              <Card>
                <DayPicker
                  month={new Date(moment(currentDate).year(), moment(currentDate).month())}
                  selectedDays={new Date(currentDate)}
                  onDayClick={this.setCurrentDay}
                  className={styles.sidebar_calendar}
                  noTarget
                />
              </Card>
            </div>
            <div className={styles.sidebar_rowRequest}>
              <div xs={12} className={styles.sidebar_request} >
                <RequestsContainer
                  key={'scheduleRequests'}
                />
              </div>
            </div>
          </div>
        </div>
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
  setCreatingPatient: PropTypes.func,
  unit: PropTypes.number,
  appsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  accountsFetched: PropTypes.bool,
};

export default ScheduleComponent;
