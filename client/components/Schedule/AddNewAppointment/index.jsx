
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { reset } from 'redux-form';
import moment from 'moment';
import DisplayForm from './DisplayForm';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import {
  fetchEntities,
  createEntityRequest,
  updateEntityRequest,
  deleteEntityRequest,
} from '../../../thunks/fetchEntities';
import { IconButton } from '../../library';
import styles from './styles.scss';

const mergeTime = (date, time) => {
  return new Date(date.setHours(time.getHours()));
};

class AddNewAppointment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
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
      duration,
    } = appointmentValues;

    const {
      patientData,
      note,
    } = patientValues;

    const bufferTime = duration[1] - duration[0]
    const totalDurationMin = duration[0] + bufferTime;

    const startDate = mergeTime(new Date(date), new Date(time));
    const endDate = moment(startDate).minute(totalDurationMin);

    const newAppointment = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      patientId: patientData.id,
      serviceId,
      practitionerId,
      chairId,
      note,
      isSyncedWithPMS: false,
      customBufferTime: bufferTime,
    };

    if (!selectedAppointment) {
      createEntityRequest({ key: 'appointments', entityData: newAppointment });
      reinitializeState();
      reset(formName);
    } else {
      const appModel = selectedAppointment.appointment.appModel;
      const valuesMap = Map(newAppointment);
      const modifiedAppointment = appModel.merge(valuesMap);
      updateEntityRequest({ key: 'appointments', model: modifiedAppointment });
      reinitializeState();
    }
  }

  getSuggestions(value) {
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then((searchData) => {
        return searchData.patients;
      }).then((searchedPatients) => {
        return Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          (key) => { return searchedPatients[key]; }) : [];
      });
  }

  render() {
    const {
      formName,
      services,
      patients,
      chairs,
      practitioners,
      reset,
      selectedAppointment,
      deleteEntityRequest,
    } = this.props;

    const remoteButtonProps = {
      onClick: this.handleSubmit,
      form: formName,
    };

    console.log(formName);



    return (
      <div className={styles.formContainer}>
        <IconButton
          icon={selectedAppointment ? "trash" : "times-circle-o"}
          onClick={()=>{
            if (!selectedAppointment) {
              reset(formName);
              return this.props.reinitializeState();
            } else {
              deleteEntityRequest({ key: 'appointments', id: selectedAppointment.appointment.id });
              return this.props.reinitializeState();
            }
          }}
          className={styles.trashIcon}
        />
        <DisplayForm
          key={formName}
          services={services}
          patients={patients}
          chairs={chairs}
          practitioners={practitioners}
          getSuggestions={this.getSuggestions}
          handleSubmit={this.handleSubmit}
          formName={formName}
          selectedAppointment={selectedAppointment}
        />
        <div className={styles.remoteSubmit}>
          <RemoteSubmitButton
            {...remoteButtonProps}
            className={styles.remoteSubmit_button}
          >
            Save
          </RemoteSubmitButton>
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
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddNewAppointment);
