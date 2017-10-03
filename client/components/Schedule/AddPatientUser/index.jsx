
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NewPatientForm from './NewPatientForm';
import { Card, CardHeader, Icon } from '../../library';
import { change } from 'redux-form';
import styles from './styles.scss';
import { createEntityRequest } from '../../../thunks/fetchEntities';

class AddPatientUser extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const {
      mergingPatientData,
      reinitializeState,
      selectAppointment,
      createEntityRequest,
    } = this.props;

    const {
      requestData,
      patientUser,
    } = mergingPatientData;

    const phoneNumber = values.phoneNumber;

    values.isSyncedWithPms = false;
    values.patientUserId = patientUser.id;
    values.mobilePhoneNumber = phoneNumber;

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

    createEntityRequest({
      key: 'patients',
      entityData: values,
    }).then((result) => {
      const newPatientId = Object.keys(result.patients)[0];
      appointment.patientId = newPatientId;
      reinitializeState();
      selectAppointment(appointment);
    });
  }

  render() {
    const {
      mergingPatientData,
    } = this.props;

    return (
      <NewPatientForm
        mergingPatientData={mergingPatientData}
        formName="Create New Patient"
        onSubmit={this.handleSubmit}
        handleDatePicker={this.handleDatePicker}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    change,
    //reset,
  }, dispatch);
};

const enhance = connect(null, mapDispatchToProps)
export default enhance(AddPatientUser);
