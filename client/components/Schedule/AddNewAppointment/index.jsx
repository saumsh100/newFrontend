
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
import { Button, IconButton, Avatar } from '../../library';
import styles from './styles.scss';
import { SortByFirstName } from '../../library/util/SortEntities';


const mergeTime = (date, time) => {
  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  return new Date(date);
};

// Disabled for handleDateChange
function dayOfWeekAsString(dayIndex) {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ][dayIndex];
}

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesAllowed: this.props.services,
      patientSearched: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.handlePractitionerChange = this.handlePractitionerChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleBufferChange = this.handleBufferChange.bind(this);
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
      buffer,
      duration,
    } = appointmentValues;

    const {
      patientSelected,
      note,
    } = patientValues;


    let totalDurationMin = duration + buffer;

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
      customBufferTime: buffer,
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

    const alertRequestUpdate = {
      success: {
        body: `Request Confirmed for ${patientSelected.firstName}'s Appointment`,
      },
      error: {
        body: `Request failed for ${patientSelected.firstName} Failed`,
      },
    };

    // if an appointment is not selected then create the appointment else update the appointment
    if (!selectedAppointment || (selectedAppointment && selectedAppointment.request)) {
      const requestId = selectedAppointment ? selectedAppointment.requestModel.get('id') : null;
      console.log(requestId);
      return createEntityRequest({
        key: 'appointments',
        entityData: newAppointment,
        alert: alertCreate,
      }).then((data) => {
        if (selectedAppointment && selectedAppointment.request) {
          return updateEntityRequest({
            key: 'requests',
            model: selectedAppointment.requestModel,
            alert: alertRequestUpdate,
          }).then(() => {
            this.props.updateEntityRequest({
              url: `/api/requests/${requestId}/confirm/${Object.keys(data.appointments)[0]}`,
              values: {},
            })
            .then(() => {
              reinitializeState();
              reset(formName);
            });
          });
        } else {
          reinitializeState();
          reset(formName);
        }
      });

    } 
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

  handleSliderChange(value) {
    const {
      change,
      formName,
      unit,
    } = this.props;

    const duration = value[0];
    const buffer = value[1];

    change(formName, 'appointment.duration', duration);
    change(formName, 'appointment.buffer', buffer - duration);
    change(formName, 'appointment.unit', (duration / unit).toFixed(2));
  }

  handleDurationChange(value) {
    const {
      change,
      formName,
      appFormValues,
      unit,
    } = this.props;

    change(formName, 'appointment.unit', (value / unit).toFixed(2));

    if (value >= unit && value <= 180 && appFormValues) {
      change(formName, 'appointment.slider', [value, value]);
      change(formName, 'appointment.buffer', 0);
    }
  }

  handleUnitChange(value) {
    const {
      change,
      formName,
      unit,
    } = this.props;

    const duration = value * unit;

    if (duration <= 180 && duration >= unit) {
      change(formName, 'appointment.duration', duration);
      change(formName, 'appointment.slider', [duration, duration]);
      change(formName, 'appointment.buffer', 0);
    }
  }

  handleBufferChange(value) {
    const {
      change,
      formName,
      appFormValues,
    } = this.props;

    const duration = (appFormValues && appFormValues.appointment.slider) ? appFormValues.appointment.slider[0] : 60;

    const bufferValue = duration + value;
    if (bufferValue >= duration && bufferValue <= 180) {
      change(formName, 'appointment.slider', [duration, bufferValue]);
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
    const practitionerServiceIds = selectedPractitioner ? selectedPractitioner.get('services') : null;

    const servicesAllowed = [];
    practitionerServiceIds.map((serviceId) => {
      if (!servicesAllowed.includes(services.get(serviceId))) {
        servicesAllowed.push(services.get(serviceId));
      }
    });

    change(formName, 'appointment.serviceId', '');
    this.setState({
      servicesAllowed,
    });
  }

  handleAutoSuggest(newValue) {
    if (typeof newValue === 'object') {
      this.props.setPatientSearched(newValue);
    } else if (newValue === '') {
      this.props.setPatientSearched('');
    }
  }

  getSuggestions(value) {
    return this.props.fetchEntities({ url: '/api/patients/search', params: { patients: value } })
      .then((searchData) => searchData.patients).then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          key => searchedPatients[key]) : [];

        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="lg" />
              <span className={styles.suggestionContainer_fullName}>
                {`${patient.firstName} ${patient.lastName}, ${moment().diff(patient.birthDate, 'years')}`}
              </span>
            </div>
          );
        });
        return patientList;
      });
  }

  deleteAppointment() {
    const {
      selectedAppointment,
      reinitializeState,
      updateEntityRequest,
    } = this.props;

    const deleteApp = confirm('Are you sure you want to delete this appointment?');

    if (deleteApp) {
      const delModel = Map({
        isDeleted: true,
        isSyncedWithPMS: false,
      });
      const appModel = selectedAppointment.appModel;
      const deletedModel = appModel.merge(delModel);
      updateEntityRequest({ key: 'appointments', model: deletedModel });
    }

    reinitializeState();
  }

  render() {
    const {
      formName,
      patients,
      chairs,
      practitioners,
      selectedAppointment,
      reinitializeState,
      unit,
    } = this.props;

    const remoteButtonProps = {
      onClick: reinitializeState,
      form: formName,
    };

    return (
      <div className={styles.formContainer}>
        <IconButton
          icon="times"
          onClick={() => {
            this.props.reset(formName);
            return reinitializeState();
          }}
          className={styles.trashIcon}
        />
        <DisplayForm
          key={formName}
          formName={formName}
          services={this.state.servicesAllowed}
          practitioners={practitioners}
          patients={patients}
          chairs={chairs}
          selectedAppointment={selectedAppointment}
          patientSearched={this.props.patientSearched}
          unit={unit}
          getSuggestions={this.getSuggestions}
          handleSubmit={this.handleSubmit}
          handleAutoSuggest={this.handleAutoSuggest}
          handlePractitionerChange={this.handlePractitionerChange}
          handleSliderChange={this.handleSliderChange}
          handleDurationChange={this.handleDurationChange}
          handleUnitChange={this.handleUnitChange}
          handleBufferChange={this.handleBufferChange}
        />
        <div className={styles.remoteSubmit}>
          <RemoteSubmitButton
            {...remoteButtonProps}
            className={styles.remoteSubmit_button}
          >
            Save
          </RemoteSubmitButton>
          {selectedAppointment && !selectedAppointment.request && (
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
}


function mapStateToProps({ entities, form, auth }, { formName }) {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);

  if (!form[formName] || !activeAccount.get('unit')) {
    return {
      values: {},
      unit: 15,
    };
  }

  return {
    appFormValues: form[formName].values,
    unit: activeAccount.get('unit'),
  };
}

AddNewAppointment.propTypes = {
  formName: PropTypes.string.isRequired,
  services: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  chairs: PropTypes.array,
  practitioners: PropTypes.object.isRequired,
  weeklySchedule: PropTypes.object,
  unit: PropTypes.number,
  selectedAppointment: PropTypes.object,
  deleteEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  change: PropTypes.func,
  reinitializeState: PropTypes.func,
  fetchEntities: PropTypes.func,
  updateEntityRequest: PropTypes.func,
};

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(AddNewAppointment);
