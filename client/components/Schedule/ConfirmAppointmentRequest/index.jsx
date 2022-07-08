import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import { selectAppointmentShape } from '../../library/PropTypeShapes';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import SendConfirmationEmail from './SendConfirmationEmail';
import AppointmentSummary from './AppointmentSummary';
import AppointmentSuggestions from './AppointmentSuggestions';
import { nonApptWritePMS } from '../../library';

class ConfirmAppointmentRequest extends Component {
  constructor(props) {
    super(props);

    const { selectedAppointment } = this.props;

    const appointments = selectedAppointment.nextAppt;

    this.state = {
      selectedApp: appointments && appointments.length === 1 && appointments[0],
    };

    this.confirmRequest = this.confirmRequest.bind(this);
    this.createAppointment = this.createAppointment.bind(this);
    this.setSelected = this.setSelected.bind(this);
  }

  setSelected(app) {
    this.setState({ selectedApp: app });
  }

  createAppointment() {
    const modifiedAppointment = this.props.selectedAppointment;
    modifiedAppointment.nextAppt = false;
    this.props.reinitializeState();
    this.props.selectAppointment(modifiedAppointment);
  }

  confirmRequest(patient, sendEmail) {
    const { selectedAppointment, reinitializeState, redirect, setLocation } = this.props;

    const { requestModel } = selectedAppointment;

    if (redirect) {
      setLocation(redirect);
    }
    const patientModel = this.props.patients.get(this.state.selectedApp.patientId);
    const patientUserId = requestModel.get('patientUserId');
    if (patientUserId !== patientModel.get('patientUserId')) {
      const modifiedPatient = patientModel.set('patientUserId', patientUserId);

      this.props.updateEntityRequest({
        key: 'patients',
        model: modifiedPatient,
        url: `/api/patients/${modifiedPatient.get('id')}`,
      });
    }

    if (sendEmail) {
      const alertRequestUpdate = {
        success: { body: `Email confirmation sent to ${patient.getFullName()}` },
        error: { body: `Request failed for ${patient.getFullName()} Failed` },
      };
      this.props
        .updateEntityRequest({
          url: `/api/requests/${requestModel.get('id')}/confirm/${this.state.selectedApp.id}`,
          values: {},
          alert: alertRequestUpdate,
        })
        .then(() => {
          reinitializeState();
        });
    } else {
      const modifiedAppointment = selectedAppointment.requestModel.set(
        'appointmentId',
        this.state.selectedApp.id,
      );
      const alertRequestUpdate = {
        success: { body: `Request updated for ${patient.getFullName()}` },
        error: { body: `Request failed for ${patient.getFullName()} Failed` },
      };
      this.props
        .updateEntityRequest({
          key: 'requests',
          model: modifiedAppointment,
          alert: alertRequestUpdate,
        })
        .then(() => reinitializeState());
    }
  }

  render() {
    const { patients, selectedAppointment, sendEmail, showApptSummary, apptWrite } = this.props;

    const { selectedApp } = this.state;

    if (showApptSummary && !apptWrite) {
      return <AppointmentSummary {...this.props} />;
    }

    if (!selectedAppointment) {
      return null;
    }

    const patient = patients.get(selectedAppointment.patientId || selectedApp.patientId);
    const appointments = selectedAppointment.nextAppt;

    if (sendEmail) {
      return (
        <SendConfirmationEmail
          selectedApp={selectedApp}
          confirmRequest={this.confirmRequest}
          patient={patient}
          length={appointments.length}
        />
      );
    }

    return (
      <AppointmentSuggestions
        {...this.props}
        selectedApp={selectedApp}
        setSelected={this.setSelected}
        apptWrite={apptWrite}
        createAppointment={this.createAppointment}
      />
    );
  }
}

ConfirmAppointmentRequest.propTypes = {
  patients: PropTypes.instanceOf(Map).isRequired,
  redirect: PropTypes.shape({ pathname: PropTypes.string }),
  reinitializeState: PropTypes.func.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.shape(selectAppointmentShape),
  sendEmail: PropTypes.bool.isRequired,
  setLocation: PropTypes.func.isRequired,
  setSendEmail: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  showApptSummary: PropTypes.bool.isRequired,
  setShowApptSummary: PropTypes.func.isRequired,
  requests: PropTypes.instanceOf(Map).isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  apptWrite: PropTypes.bool.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  lastSummaryRequest: PropTypes.string.isRequired,
};

ConfirmAppointmentRequest.defaultProps = {
  redirect: null,
  selectedAppointment: null,
};

function mapStateToProps({ auth, entities }) {
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const services = entities.getIn(['services', 'models']);
  const requests = entities.getIn(['requests', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);
  const apptWrite = !nonApptWritePMS(auth.get('adapterType'));

  return {
    timezone: auth.get('timezone'),
    patientUsers,
    services,
    requests,
    practitioners,
    apptWrite,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      setLocation: push,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ConfirmAppointmentRequest);
