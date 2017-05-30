
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

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servicesAllowed: this.props.services,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.handlePractitionerChange = this.handlePractitionerChange.bind(this);
  }

  handleSubmit(values) {
    const {
      selectedAppointment,
      createEntityRequest,
      updateEntityRequest,
      reinitializeState,
      reset,
      formName,
      selectAppointment,
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
      isSyncedWithPMS: false,
      customBufferTime: bufferTime,
    };

    // if an appointment is not selected then create the appointment else update the appointment
    if (!selectedAppointment.appointment || selectedAppointment.flag === 'request') {
      createEntityRequest({ key: 'appointments', entityData: newAppointment }).then((result) => {
        if (!result) {
          alert('This appointment is invalid');
        } else {
          if (selectedAppointment.flag === 'request') {
            selectAppointment({ appointment: null, flag: 'Appointment Created' });
          }
          reinitializeState();
          reset(formName);
        }
      }).catch(error => error);

    } else {
      const appModel = selectedAppointment.appointment.appModel;
      const appModelSynced = appModel.set('isSyncedWithPMS', false);
      const valuesMap = Map(newAppointment);
      const modifiedAppointment = appModelSynced.merge(valuesMap);
      updateEntityRequest({ key: 'appointments', model: modifiedAppointment }).then((result)=>{
        if (!result) {
          alert('This appointment edit is invalid');
        } else {
          reinitializeState();
        }
      }).catch(error => error);
    }
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
      change(formName, 'patient.phoneNumber', newValue.phoneNumber);
      change(formName, 'patient.email', newValue.email);
    }
  }

  handlePractitionerChange(id) {
    const {
      services,
      practitioners,
    } = this.props;

    const selectedPractitioner = practitioners.get(id);
    const practitionerServiceIds = selectedPractitioner.get('services');

    const servicesAllowed = [];
    practitionerServiceIds.map((serviceId) => {
      servicesAllowed.push(services.get(serviceId));
    });

    this.setState({
      servicesAllowed,
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
      const appModel = selectedAppointment.appointment.appModel;
      const deletedModel = appModel.set('isDeleted', true);
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
    } = this.props;

    const remoteButtonProps = {
      onClick: this.handleSubmit,
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
          patients={patients}
          chairs={chairs}
          practitioners={practitioners}
          selectedAppointment={selectedAppointment}
          getSuggestions={this.getSuggestions}
          handleSubmit={this.handleSubmit}
          handleAutoSuggest={this.handleAutoSuggest}
          handlePractitionerChange={this.handlePractitionerChange}
        />
        <div className={styles.remoteSubmit}>
          <RemoteSubmitButton
            {...remoteButtonProps}
            className={styles.remoteSubmit_button}
          >
            Save
          </RemoteSubmitButton>
          {(selectedAppointment.flag === 'edit') && (
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

AddNewAppointment.PropTypes = {
  formName: PropTypes.string,
  services: PropTypes.object,
  patients: PropTypes.object,
  chairs: PropTypes.object,
  practitioners: PropTypes.object,
  selectedAppointment: PropTypes.object,
  deleteEntityRequest: PropTypes.func,
  reset: PropTypes.func,
  change: PropTypes.func,
  reinitializeState: PropTypes.func,
};

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddNewAppointment);
