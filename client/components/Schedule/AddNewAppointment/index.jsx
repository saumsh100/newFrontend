
import React, { Component, PropTypes } from 'react';
import { reset } from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DisplayForm from './DisplayForm';
import { fetchEntities, createEntityRequest } from '../../../thunks/fetchEntities';
import { IconButton } from '../../library';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
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
      createEntityRequest,
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
      patient,
      note,
    } = patientValues;

    const totalDurationMin = (duration[0] + (duration[1] - duration[0]));
    const startDate = mergeTime(new Date(date), new Date(time));
    const endDate = moment(startDate).minute(totalDurationMin);

    const appointment = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      patientId: patient.id,
      serviceId,
      practitionerId,
      chairId,
      note,
      isSyncedWithPMS: false,
    };

    createEntityRequest({ key: 'appointments', entityData: appointment });
    reinitializeState();
    reset(formName);
  }

  getSuggestions(value) {
    return this.props.fetchEntities({ url: '/api/patients/search', params:  { patients: value } })
      .then((searchData) => {
        return searchData.patients;
      }).then((searchedPatients) => {
        const results = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          (key) => { return searchedPatients[key]; }) : [];
        this.setState({ patientResult: results })
        return results;
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
    } = this.props;

    const remoteButtonProps = {
      onClick: this.handleSubmit,
      form: formName,
    };

    return (
      <div className={styles.formContainer}>
        <IconButton
          icon="trash"
          onClick={(e)=>{
            e.stopPropagation();
            reset(formName);
            return this.props.reinitializeState();
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
    reset,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddNewAppointment);
