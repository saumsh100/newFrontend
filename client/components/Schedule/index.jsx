import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { push } from 'connected-react-router';
import { Map, List } from 'immutable';
import { isHub, isResponsive } from '../../util/hub';
import {
  Card,
  SBody,
  SContainer,
  Button,
  Modal,
  DialogBox,
  DialogBody,
  DayPicker,
  getUTCDate,
  getUTCDateObj,
  nonApptWritePMS,
} from '../library';
import RequestsContainer from '../../containers/RequestContainer';
import DayView from './DayView';
import AddNewAppointment from './AddNewAppointment';
import AddPatient from './AddPatient';
import AddPatientSuggestions from './AddPatientSuggestions';
import ScheduleModal from './ScheduleModal';
import Header from './Header';
import RemoteSubmitButton from '../library/Form/RemoteSubmitButton';
import ConfirmAppointmentRequest from './ConfirmAppointmentRequest/index';
import AssignPatientToChatDialog from '../Patients/AssignPatientToChatDialog';
import { selectAppointmentShape, practitionerShape } from '../library/PropTypeShapes';
import styles from './styles.scss';

class ScheduleComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      assignPatientToChatModalActive: false,
      patient: null,
      addNewAppointment: false,
      showSchedule: false,
      patientSearched: null,
      sendEmail: false,
      showInput: false,
      showApptSummary: false,
      lastSummaryRequest: null,
    };
    this.setCurrentDay = this.setCurrentDay.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.addNewAppointment = this.addNewAppointment.bind(this);
    this.showSchedule = this.showSchedule.bind(this);
    this.setPatientSearched = this.setPatientSearched.bind(this);
    this.setSendEmail = this.setSendEmail.bind(this);
    this.nextDay = this.nextDay.bind(this);
    this.previousDay = this.previousDay.bind(this);
    this.setShowInput = this.setShowInput.bind(this);
    this.handlePatientUserSubmit = this.handlePatientUserSubmit.bind(this);
    this.handlePatientSubmit = this.handlePatientSubmit.bind(this);
    this.setCreatingPatient = this.setCreatingPatient.bind(this);
    this.closeAssignPatientModal = this.closeAssignPatientModal.bind(this);
  }

  componentDidMount() {
    if (isHub()) {
      this.updateHubData({
        ...this.props,
        pageTitle: this.pageTitle,
      });
    }
  }

  componentDidUpdate() {
    if (isHub()) {
      this.updateHubData({
        ...this.props,
        pageTitle: this.pageTitle,
      });
    }
  }

  setCreatingPatient(value = false) {
    this.props.setCreatingPatient({ creatingPatientBool: value });
  }

  setPatientSearched(patientSearched) {
    this.setState({ patientSearched });
  }

  setSendEmail() {
    this.setState((prevState) => ({ sendEmail: !prevState.sendEmail }));
  }

  setShowInput(showBool) {
    this.setState({ showInput: showBool });
  }

  setCurrentDay(day) {
    this.props.setScheduleDate({ scheduleDate: getUTCDate(day).toISOString() });
  }

  setShowApptSummary = () => {
    this.setState({ showApptSummary: true });
  };

  openAssignPatientToChatModal(patient) {
    this.setState({
      patient,
      assignPatientToChatModalActive: true,
    });
  }

  nextDay(currentDay) {
    this.props.setScheduleDate({
      scheduleDate: getUTCDate(currentDay)
        .add(1, 'days')
        .toISOString(),
    });
  }

  previousDay(currentDay) {
    this.props.setScheduleDate({
      scheduleDate: getUTCDate(currentDay)
        .subtract(1, 'days')
        .toISOString(),
    });
  }

  addNewAppointment() {
    this.setState({ addNewAppointment: true });
  }

  showSchedule() {
    this.setState({ showSchedule: true });
  }

  updateHubData(props) {
    const {
      router: { location },
      pageTitle,
    } = props;

    props.setTitle(pageTitle);
    props.setBackHandler(() => {
      this.reinitializeState();
      props.push({
        ...location,
        pathname: '/requests',
      });
    });
  }

  reinitializeState() {
    const { selectedAppointment } = this.props;
    const noNextAppt = !!selectedAppointment && !selectedAppointment.nextAppt;
    const showApptSummary = this.state.showApptSummary || noNextAppt;
    if (showApptSummary) {
      this.setState({ lastSummaryRequest: selectedAppointment?.requestId });
    }
    this.props.setMergingPatient({
      patientUser: null,
      requestData: null,
      suggestions: [],
    });
    this.props.setCreatingPatient(false);
    this.props.selectAppointment(null);
    this.setState({
      showSchedule: false,
      addNewAppointment: false,
      patientSearched: null,
      sendEmail: false,
      showInput: false,
      showApptSummary: false,
    });
  }

  closeAssignPatientModal() {
    this.setState({
      assignPatientToChatModalActive: false,
      patient: null,
    });
  }

  handlePatientUserSubmit(values) {
    const { schedule, selectAppointment, createEntityRequest } = this.props;

    const mergingPatientData = schedule.get('mergingPatientData');

    const { requestData, patientUser } = mergingPatientData;

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
      success: { body: 'New Patient Added.' },
      error: { body: 'Failed to add patient.' },
    };

    createEntityRequest({
      key: 'patients',
      entityData: values,
      alert,
    }).then(({ patients }) => {
      const [patient] = Object.values(patients);
      appointment.patientId = patient.id;
      selectAppointment(appointment);
      if (patient.foundChatId) {
        this.props.reset('Create New Patient User', {}, false);
        return this.openAssignPatientToChatModal(patient);
      }
      return this.reinitializeState();
    });
  }

  handlePatientSubmit(values) {
    const alert = {
      success: { body: 'New Patient Added.' },
      error: { body: 'Failed to add patient.' },
    };

    this.props
      .createEntityRequest({
        key: 'patients',
        entityData: values,
        alert,
      })
      .then(({ patients }) => {
        const [patient] = Object.values(patients);
        this.props.setCreatingPatient({ createPatientBool: false });
        this.props.reset('Create New Patient', {}, false);
        if (patient.foundChatId) {
          return this.openAssignPatientToChatModal(patient);
        }
        return true;
      });
  }

  render() {
    const {
      practitioners,
      appointments,
      events,
      schedule,
      patients,
      services,
      chairs,
      selectAppointment,
      selectedAppointment,
      setMergingPatient,
      unit,
      appsFetched,
      eventsFetched,
      pracsFetched,
      chairsFetched,
      accountsFetched,
      apptWrite,
    } = this.props;

    const { addNewAppointment, showSchedule, lastSummaryRequest } = this.state;

    const hubRedirect = { pathname: '/requests' };

    let formName = 'NewAppointmentForm';
    if (selectedAppointment) {
      formName = `editAppointment_${selectedAppointment.serviceId}`;
    }

    const mergingPatientData = schedule.get('mergingPatientData');
    const createNewPatient = schedule.get('createNewPatient');
    const leftColumnWidth = schedule.get('leftColumnWidth');
    const currentDate = getUTCDate(schedule.get('scheduleDate'), this.props.timezone);

    const filterPractitioners = practitioners.get('models').filter((prac) => prac.get('isActive'));
    const filterChairs = chairs.get('models').filter((chair) => chair.get('isActive'));

    const sameApptTitle = isResponsive()
      ? 'Is this the same appointment?'
      : 'Could this be the same appointment?';

    let displayTitle = this.state.sendEmail ? 'Send Confirmation Email?' : sameApptTitle;
    const noNextAppt = !!selectedAppointment && !selectedAppointment.nextAppt;
    const showApptSummary = this.state.showApptSummary || noNextAppt;
    if (showApptSummary) {
      displayTitle = 'Accept Appointment';
    }
    let displayModalComponent = null;
    let actions = [];

    if (selectedAppointment && (selectedAppointment.nextAppt || !apptWrite)) {
      displayModalComponent = (
        <ConfirmAppointmentRequest
          patients={patients.get('models')}
          selectedAppointment={selectedAppointment}
          selectAppointment={selectAppointment}
          reinitializeState={this.reinitializeState}
          setCurrentDay={this.setCurrentDay}
          setSendEmail={this.setSendEmail}
          sendEmail={this.state.sendEmail}
          showApptSummary={showApptSummary}
          setShowApptSummary={this.setShowApptSummary}
          lastSummaryRequest={lastSummaryRequest}
          redirect={isHub() && hubRedirect}
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
      displayTitle = 'Create New Patient';
      const patientFormName = 'Create New Patient User';

      actions = [
        {
          label: 'Cancel',
          onClick: this.reinitializeState,
          component: Button,
          props: { border: 'blue' },
        },
        {
          label: 'Save',
          onClick: this.handlePatientUserSubmit,
          component: RemoteSubmitButton,
          props: {
            color: 'blue',
            form: patientFormName,
            removePristineCheck: true,
          },
        },
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
        {
          label: 'Cancel',
          onClick: () => {
            this.setCreatingPatient(false);
          },
          component: Button,
          props: { border: 'blue' },
        },
        {
          label: 'Save',
          onClick: this.handlePatientSubmit,
          component: RemoteSubmitButton,
          props: {
            color: 'blue',
            form: patientFormName,
          },
        },
      ];

      displayModalComponent = (
        <AddPatient formName={patientFormName} onSubmit={this.handlePatientSubmit} />
      );
    }

    const isAddNewAppointment = addNewAppointment || (noNextAppt && apptWrite);

    if (isAddNewAppointment) {
      displayTitle = 'Accept Appointment';
    }

    const showDialog =
      (selectedAppointment && selectedAppointment.nextAppt) ||
      !!mergingPatientData.patientUser ||
      showApptSummary ||
      createNewPatient;

    this.pageTitle = displayTitle;
    const appsEventsFetched = appsFetched && eventsFetched;
    const allFetched = appsEventsFetched && accountsFetched && chairsFetched && pracsFetched;

    return isHub() ? (
      <div className={styles.hubWrapper}>
        {allFetched && isAddNewAppointment && (
          <AddNewAppointment
            formName={formName}
            chairs={filterChairs}
            practitioners={filterPractitioners}
            patients={patients.get('models')}
            reinitializeState={this.reinitializeState}
            setPatientSearched={this.setPatientSearched}
            patientSearched={this.state.patientSearched}
            unit={unit}
            currentDate={currentDate}
            showInput={this.state.showInput}
            setShowInput={this.setShowInput}
            selectedAppointment={this.props.selectedAppointment}
            setCreatingPatient={this.props.setCreatingPatient}
            redirect={isHub() && hubRedirect}
            timezone={this.props.timezone}
          />
        )}
        {allFetched && showDialog && (
          <DialogBody actions={actions.filter((v) => v.label !== 'Cancel')}>
            {displayModalComponent}
          </DialogBody>
        )}
      </div>
    ) : (
      <div className={styles.rowMainContainer}>
        <div className={styles.dayViewContainer}>
          <Card className={styles.card} runAnimation loaded={allFetched}>
            <SContainer>
              <Header
                addNewAppointment={this.addNewAppointment}
                showSchedule={this.showSchedule}
                schedule={schedule}
                chairs={filterChairs}
                practitioners={practitioners.get('models')}
                appointments={appointments}
                previousDay={this.previousDay}
                setCurrentDay={this.setCurrentDay}
                nextDay={this.nextDay}
                reinitializeState={this.reinitializeState}
              />
              <SBody>
                <DayView
                  currentDate={currentDate}
                  practitioners={practitioners.get('models')}
                  patients={patients}
                  chairs={chairs}
                  services={services}
                  appointments={appointments}
                  events={events}
                  schedule={schedule}
                  selectAppointment={selectAppointment}
                  leftColumnWidth={leftColumnWidth}
                />
                {allFetched && showSchedule && (
                  <ScheduleModal reinitializeState={this.reinitializeState} />
                )}
                {allFetched ? (
                  <Modal
                    active={isAddNewAppointment}
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
                      setPatientSearched={this.setPatientSearched}
                      patientSearched={this.state.patientSearched}
                      unit={unit}
                      currentDate={currentDate}
                      showInput={this.state.showInput}
                      setShowInput={this.setShowInput}
                      selectedAppointment={this.props.selectedAppointment}
                      setCreatingPatient={this.props.setCreatingPatient}
                      timezone={this.props.timezone}
                    />
                  </Modal>
                ) : null}
                {allFetched && (!isAddNewAppointment || createNewPatient) ? (
                  <DialogBox
                    title={displayTitle}
                    type={createNewPatient ? 'small' : 'medium'}
                    actions={actions}
                    active={showDialog}
                    onEscKeyDown={this.reinitializeState}
                    onOverlayClick={
                      createNewPatient ? this.setCreatingPatient : this.reinitializeState
                    }
                  >
                    {displayModalComponent}
                  </DialogBox>
                ) : null}
              </SBody>
            </SContainer>
          </Card>
        </div>
        <div className={styles.sidebar}>
          <div className={styles.sidebar_rowCalendar}>
            <Card>
              <DayPicker
                month={new Date(currentDate.year(), currentDate.month())}
                selectedDays={getUTCDateObj(currentDate)}
                onChange={this.setCurrentDay}
                className={styles.sidebar_calendar}
                timezone={this.props.timezone}
                noTarget
              />
            </Card>
          </div>
          <div className={styles.sidebar_rowRequest}>
            <div className={styles.sidebar_request}>
              <RequestsContainer key="scheduleRequests" />
            </div>
          </div>
        </div>
        <AssignPatientToChatDialog
          callback={this.closeAssignPatientModal}
          patient={this.state.patient}
          active={this.state.assignPatientToChatModalActive}
        />
      </div>
    );
  }
}

ScheduleComponent.propTypes = {
  accountsFetched: PropTypes.bool,
  appsFetched: PropTypes.bool,
  eventsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  unit: PropTypes.number.isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  selectedAppointment: PropTypes.shape(selectAppointmentShape),
  selectAppointment: PropTypes.func.isRequired,
  setCreatingPatient: PropTypes.func.isRequired,
  setMergingPatient: PropTypes.func.isRequired,
  setScheduleDate: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  practitioners: PropTypes.shape(practitionerShape).isRequired,
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)),
  events: PropTypes.objectOf(PropTypes.instanceOf(List)),
  services: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  patients: PropTypes.objectOf(PropTypes.instanceOf(List)),
  chairs: PropTypes.objectOf(PropTypes.instanceOf(List)).isRequired,
  timezone: PropTypes.string.isRequired,
  apptWrite: PropTypes.bool.isRequired,
};

ScheduleComponent.defaultProps = {
  accountsFetched: false,
  chairsFetched: false,
  pracsFetched: false,
  appsFetched: false,
  eventsFetched: false,
  appointments: null,
  events: null,
  selectedAppointment: null,
  patients: null,
};

const mapStateToProps = ({ router, auth }) => ({
  router,
  timezone: auth.get('timezone'),
  apptWrite: !nonApptWritePMS(auth.get('adapterType')),
});

const mapActionsToProps = (dispatch) =>
  bindActionCreators(
    {
      push,
      reset,
    },
    dispatch,
  );

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(ScheduleComponent);
