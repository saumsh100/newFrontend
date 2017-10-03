import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import SameAppointment from './SameAppointment';
import CreateAppointment from './CreateAppointment';

class ConfirmAppointmentRequest extends Component {
  constructor(props) {
    super(props);
    this.confirmRequest = this.confirmRequest.bind(this);
    this.createAppointment = this.createAppointment.bind(this);

  }

  confirmRequest(patient) {
    const {
      selectedAppointment,
      updateEntityRequest,
      reinitializeState,
    } = this.props;

    const alertRequestUpdate = {
      success: {
        body: `Email confirmation sent to ${patient.getFullName()}`,
      },
      error: {
        body: `Request failed for ${patient.get('firstName')} Failed`,
      },
    };

    updateEntityRequest({
      key: 'requests',
      model: selectedAppointment.requestModel,
      alert: alertRequestUpdate,
    }).then(() => reinitializeState());
  }

  createAppointment() {
    const modifiedAppointment = this.props.selectedAppointment;
    modifiedAppointment.nextAppt = false;
    console.log(modifiedAppointment);
    this.props.reinitializeState();
    this.props.selectAppointment(modifiedAppointment);
  }

  render() {
    const {
      patients,
      appointments,
      selectedAppointment,
      setConfirmState,
      reinitializeState,
      confirmState,
    } = this.props;

    if (!selectedAppointment) {
      return null;
    }

    const patient = patients.get(selectedAppointment.patientId);
    const appointment = appointments.get(selectedAppointment.nextAppt);

    const displayComponent = confirmState ? (
      <SameAppointment
        patient={patient}
        appointment={appointment}
        confirmRequest={this.confirmRequest}
        createAppointment={this.createAppointment}
        setConfirmState={setConfirmState}
      />
    ) : (
      <CreateAppointment
        patient={patient}
        request={selectedAppointment.requestModel}
        reinitializeState={reinitializeState}
        createAppointment={this.createAppointment}
      />
    );
    return <div>{displayComponent}</div>;
  }
}

ConfirmAppointmentRequest.propTypes = {
  updateEntityRequest: PropTypes.func.required,
  reinitializeState: PropTypes.func.required,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
};

const enhance = connect(null, mapDispatchToProps);

export default enhance(ConfirmAppointmentRequest);
