
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import { Map } from 'immutable';
import { isHub } from '../../util/hub';
import { setBackHandler, setTitle } from '../../reducers/electron';
import Requests from '../../entities/models/Request';
import Practitioners from '../../entities/models/Practitioners';
import Account from '../../entities/models/Account';
import Service from '../../entities/models/Service';
import Patient from '../../entities/models/Patient';
import Chair from '../../entities/models/Chair';
import Appointments from '../../entities/models/Appointments';
import {
  Card,
  SBody,
  SContainer,
  Button,
  Modal,
  DialogBox,
  DialogBody,
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

  componentDidMount() {
    if (isHub()) {
      this.updateHubData({ ...this.props, pageTitle: this.pageTitle });
    }
  }

  componentDidUpdate() {
    if (isHub()) {
      this.updateHubData({ ...this.props, pageTitle: this.pageTitle });
    }
  }

  setCreatingPatient(value = false) {
    this.props.setCreatingPatient({ creatingPatientBool: value });
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

  setCurrentDay(day) {
    this.props.setScheduleDate({ scheduleDate: moment(day) });
  }

  nextDay(currentDay) {
    this.props.setScheduleDate({ scheduleDate: moment(currentDay).add(1, 'days') });
  }

  previousDay(currentDay) {
    this.props.setScheduleDate({ scheduleDate: moment(currentDay).subtract(1, 'days') });
  }

  addNewAppointment() {
    this.setState({
      addNewAppointment: true,
    });
  }

  updateHubData(props) {
    const { routing: { location }, pageTitle } = props;

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

  handlePatientUserSubmit(values) {
    const { schedule, selectAppointment, createEntityRequest } = this.props;

    const mergingPatientData = schedule.toJS().mergingPatientData;

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

    this.props
      .createEntityRequest({
        key: 'patients',
        entityData: values,
        alert,
      })
      .then(() => {
        this.props.setCreatingPatient({ createPatientBool: false });
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

    const { addNewAppointment } = this.state;

    const hubRedirect = {
      pathname: '/requests',
    };

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

    const sameApptTitle = isHub()
      ? 'Is this the same appointment?'
      : 'Could this be the same appointment?';

    let displayTitle = this.state.sendEmail ? 'Send Confirmation Email?' : sameApptTitle;

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
      displayTitle = 'Add New Patient';
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
          props: { color: 'blue', form: patientFormName },
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
          props: { color: 'blue', form: patientFormName },
        },
      ];

      displayModalComponent = (
        <AddPatient formName={patientFormName} onSubmit={this.handlePatientSubmit} />
      );
    }

    const isAddNewAppointment =
      addNewAppointment || (!!selectedAppointment && !selectedAppointment.nextAppt);

    if (isAddNewAppointment) {
      displayTitle = 'Accept Appointment';
    }

    const showDialog =
      (selectedAppointment && selectedAppointment.nextAppt) ||
      !!mergingPatientData.patientUser ||
      createNewPatient;

    this.pageTitle = displayTitle;
    const allFetched = appsFetched && accountsFetched && chairsFetched && pracsFetched;

    return isHub() ? (
      <div className={styles.hubWrapper}>
        {allFetched &&
          isAddNewAppointment && (
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
            redirect={isHub() && hubRedirect}
          />
        )}
        {allFetched &&
          showDialog && (
          <DialogBody actions={actions.filter(v => v.label !== 'Cancel')}>
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
                schedule={schedule}
                chairs={filterChairs}
                practitioners={filterPractitioners}
                appointments={appointments}
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
                  </Modal>
                ) : null}
                {allFetched ? (
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
                month={new Date(moment(currentDate).year(), moment(currentDate).month())}
                selectedDays={new Date(currentDate)}
                onDayClick={this.setCurrentDay}
                className={styles.sidebar_calendar}
                noTarget
              />
            </Card>
          </div>
          <div className={styles.sidebar_rowRequest}>
            <div xs={12} className={styles.sidebar_request}>
              <RequestsContainer key={'scheduleRequests'} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const routingPropType = PropTypes.shape({
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
});

export const selectAppointmentPropType = PropTypes.shape({
  createdAt: PropTypes.string,
  customBufferTime: PropTypes.number,
  endDate: PropTypes.string,
  isSyncedWithPms: PropTypes.bool,
  note: PropTypes.string,
  patientId: PropTypes.string,
  practitionerId: PropTypes.string,
  request: PropTypes.bool,
  requestId: PropTypes.string,
  requestModel: PropTypes.instanceOf(Requests),
  serviceId: PropTypes.string,
  startDate: PropTypes.string,
});

ScheduleComponent.propTypes = {
  accountsFetched: PropTypes.bool,
  appointments: PropTypes.instanceOf(Appointments),
  appsFetched: PropTypes.bool,
  chairs: PropTypes.instanceOf(Chair),
  chairsFetched: PropTypes.bool,
  createEntityRequest: PropTypes.func,
  patients: PropTypes.instanceOf(Patient),
  pracsFetched: PropTypes.bool,
  practitioners: PropTypes.instanceOf(Practitioners),
  push: PropTypes.func,
  routing: routingPropType,
  schedule: PropTypes.instanceOf(Map),
  selectAppointment: PropTypes.func,
  selectedAppointment: selectAppointmentPropType,
  services: PropTypes.instanceOf(Service),
  setBackHandler: PropTypes.func,
  setCreatingPatient: PropTypes.func,
  setMergingPatient: PropTypes.func,
  setScheduleDate: PropTypes.func,
  setTitle: PropTypes.func,
  timeOffs: PropTypes.instanceOf(Map),
  unit: PropTypes.instanceOf(Account),
  weeklySchedules: PropTypes.instanceOf(Map),
};

const mapStateToProps = ({ routing }) => ({
  routing,
});

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      push,
      setBackHandler,
      setTitle,
    },
    dispatch
  );

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(ScheduleComponent);
