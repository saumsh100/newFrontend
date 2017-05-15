
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DisplayForm from './DisplayForm';
import { fetchEntities, createEntityRequest, } from '../../../thunks/fetchEntities';

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
    const { createEntityRequest } = this.props;
    const appointmentValues = values.appointment;
    const patientValues = values.patient;

    const {
      date,
      time,
      service,
      practitioner,
      chair,
      duration,
    } = appointmentValues;

    const {
      selectedPatient,
      comment,
    } = patientValues;

    const totalDurationMin = (duration[0] + (duration[1] - duration[0]));
    const startDate = mergeTime(new Date(date), new Date(time));
    const endDate = moment(startDate).minute(totalDurationMin);

    const appointment = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      patientId: selectedPatient.id,
      serviceId: service,
      practitionerId: practitioner,
      chairId: chair,
      note: comment,
      isSyncedWithPMS: false,
    };

    createEntityRequest({ key: 'appointments', entityData: appointment });
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
      services,
      patients,
      chairs,
      practitioners,
    } = this.props;

    return (
      <DisplayForm
        services={services}
        patients={patients}
        chairs={chairs}
        practitioners={practitioners}
        getSuggestions={this.getSuggestions}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    createEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddNewAppointment);
