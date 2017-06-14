
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { change, reset } from 'redux-form';
import moment from 'moment';
import DisplayForm from './DisplayForm';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../../thunks/fetchEntities';
import { Button, IconButton } from '../../library';
import styles from './styles.scss';

const mergeTime = (date, time) => {
  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  return new Date(date);
};

function dayOfWeekAsString(dayIndex) {
  return ["sunday","monday","tuesday","wednesday","thursday","friday","saturday",][dayIndex];
}

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesAllowed: this.props.services,
      practitionersBySchedule: this.props.practitioners,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.handlePractitionerChange = this.handlePractitionerChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleSubmit(values) {
    const {
      selectedAppointment,
      createEntityRequest,
      updateEntityRequest,
      reinitializeState,
      reset,
      formName,
    } = this.props;

    const appointmentValues = values.appointment;
    const patientValues = values.patient;
    const {
      date,
      time,
      serviceId,
      practitionerId,
      chairId,
      isPatientConfirmed,
      isCancelled,
    } = appointmentValues;

    const {
      patientSelected,
      note,
    } = patientValues;

    // setting initial duration and buffer if slider isn't used.
    let duration = appointmentValues.duration;
    if (!duration) {
      duration = [60, 60];
    }

    // check if the buffer equals the duration if it doesn't set the buffer time
    let bufferTime = 0;
    if (duration[1] !== duration[0]) {
      bufferTime = duration[1] - duration[0];
    }

    let totalDurationMin = duration[0];

    if (bufferTime > 0) {
      totalDurationMin = duration[0] + bufferTime;
    }

    const startDate = mergeTime(new Date(date), new Date(time));
    const endDate = moment(startDate).add(totalDurationMin, 'minutes');

    const newAppointment = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      patientId: patientSelected.id,
      serviceId,
      practitionerId,
      chairId,
      note,
      isPatientConfirmed,
      isCancelled,
      isSyncedWithPMS: false,
      customBufferTime: bufferTime,
    };

    const alertCreate = {
      success: {
        body: `Added a new Appointment for ${patientSelected.firstName}`,
      },
      error: {
        body: 'Appointment Creation Failed',
      },
    };

    const alertUpdate = {
      success: {
        body: `Updated ${patientSelected.firstName}'s Appointment`,
      },
      error: {
        body: `Appointment Update for ${patientSelected.firstName} Failed`,
      },
    };

    // if an appointment is not selected then create the appointment else update the appointment
    if (!selectedAppointment || (selectedAppointment && selectedAppointment.request)) {
      return createEntityRequest({
        key: 'appointments',
        entityData: newAppointment,
        alert: alertCreate,
      }).then(() => {
        if (selectedAppointment && selectedAppointment.request) {
          return updateEntityRequest({
            key: 'requests',
            model: selectedAppointment.requestModel,
            alert: alertUpdate,
          }).then(() => {
            reinitializeState();
            reset(formName);
          });
        } else {
          reinitializeState();
          reset(formName);
        }
      });

    } else {
      const appModel = selectedAppointment.appModel;
      const appModelSynced = appModel.set('isSyncedWithPMS', false);
      const valuesMap = Map(newAppointment);
      const modifiedAppointment = appModelSynced.merge(valuesMap);

      return updateEntityRequest({
        key: 'appointments',
        model: modifiedAppointment,
        alert: alertUpdate,
      }).then(() => {
        reinitializeState();
      });
    }
  }

  deleteAppointment() {
    const {
      selectedAppointment,
      reinitializeState,
      updateEntityRequest,
    } = this.props;

    const deleteApp = confirm('Are you sure you want to delete this appointment?');

    if (deleteApp) {
      const appModel = selectedAppointment.appModel;
      const deletedModel = appModel.set('isDeleted', true);
      updateEntityRequest({ key: 'appointments', model: deletedModel });
    }

    reinitializeState();
  }

  getSuggestions(value) {
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then((searchData) => {
        return searchData.patients;
      }).then((searchedPatients) => {
        return Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          (key) => searchedPatients[key]) : [];
      });
  }

  handleAutoSuggest(newValue) {
    const {
      change,
      formName,
    } = this.props;

    if (typeof newValue === 'object') {
      change(formName, 'patient.mobilePhoneNumber', newValue.mobilePhoneNumber);
      change(formName, 'patient.email', newValue.email);
    }
  }

  handlePractitionerChange(id) {
    const {
      services,
      practitioners,
      change,
      formName,
    } = this.props;

    const selectedPractitioner = practitioners.get(id);
    const practitionerServiceIds = selectedPractitioner.get('services');

    const servicesAllowed = [];
    practitionerServiceIds.map((serviceId) => {
      servicesAllowed.push(services.get(serviceId));
    });

    change(formName, 'appointment.serviceId', '');
    this.setState({
      servicesAllowed,
    });
  }

  handleDateChange(day) {
    const {
      practitioners,
      change,
      formName,
      weeklySchedules,
      activeAccount,
    } = this.props;

    const clinicSchedule = activeAccount ? weeklySchedules.get(activeAccount.get('weeklyScheduleId')) : null;
    const dayOfWeek = dayOfWeekAsString(moment(day).weekday());

    const filterBySchedulePract = practitioners.toArray().filter((pr) => {
      const weeklySchedule = weeklySchedules.get(pr.get('weeklyScheduleId'));
      if (weeklySchedule && !weeklySchedule.get(dayOfWeek).isClosed) {
        return pr;
      } else if (!weeklySchedule & clinicSchedule && !clinicSchedule.get(dayOfweek).isClosed) {
        return pr
      }
    });

    change(formName, 'appointment.practitionerId', '');
    this.setState({
      practitionersBySchedule: filterBySchedulePract,
    });
  }

  render() {
    const {
      formName,
      patients,
      chairs,
      selectedAppointment,
      reinitializeState,
    } = this.props;

    const remoteButtonProps = {
      onClick: reinitializeState,
      form: formName,
    };

    return (
      <div className={styles.formContainer}>
        <IconButton
          icon="times"
          onClick={reinitializeState}
          className={styles.trashIcon}
        />
        <DisplayForm
          key={formName}
          formName={formName}
          services={this.state.servicesAllowed}
          practitioners={this.state.practitionersBySchedule}
          patients={patients}
          chairs={chairs}
          selectedAppointment={selectedAppointment}
          getSuggestions={this.getSuggestions}
          handleSubmit={this.handleSubmit}
          handleAutoSuggest={this.handleAutoSuggest}
          handlePractitionerChange={this.handlePractitionerChange}
          handleDateChange={this.handleDateChange}
        />
        <div className={styles.remoteSubmit}>
          <RemoteSubmitButton
            {...remoteButtonProps}
            className={styles.remoteSubmit_button}
          >
            Save
          </RemoteSubmitButton>
          {selectedAppointment  && (
            <div className={styles.remoteSubmit_buttonDelete}>
              <Button onClick={this.deleteAppointment} >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
    updateEntityRequest,
    deleteEntityRequest,
    reset,
    change,
  }, dispatch);
};

function mapStateToProps({ entities, auth }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!activeAccount) {
    return {};
  }

  return {
    activeAccount,
  };
}

AddNewAppointment.propTypes = {
  formName: PropTypes.string.required,
  services: PropTypes.object.required,
  patients: PropTypes.object.required,
  chairs: PropTypes.object.required,
  practitioners: PropTypes.object.required,
  weeklySchedule: PropTypes.object.required,
  activeAccount: PropTypes.object.required,
  selectedAppointment: PropTypes.object,
  deleteEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  change: PropTypes.func,
  reinitializeState: PropTypes.func,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddNewAppointment);
