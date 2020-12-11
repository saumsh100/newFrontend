
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import { formatPhoneNumber } from '@carecru/isomorphic';
import { selectAppointmentShape } from '../../library/PropTypeShapes';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Icon, Button, Avatar, SHeader } from '../../library';
import SameAppointment from './SameAppointment';
import SendConfirmationEmail from './SendConfirmationEmail';
import styles from './styles.scss';

const pluralMap = quantity => (article) => {
  const isPlural = quantity > 1;

  const plurals = {
    an: isPlural ? 'a few' : 'an',
    was: isPlural ? 'were' : 'was',
    appointment: isPlural ? 'appointments' : 'appointment',
  };

  return plurals[article];
};

class ConfirmAppointmentRequest extends Component {
  constructor(props) {
    super(props);

    const { selectedAppointment } = this.props;

    const appointments = selectedAppointment.nextAppt;

    this.state = { selectedApp: appointments && appointments.length === 1 && appointments[0] };

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

    if (redirect) {
      setLocation(redirect);
    }

    if (sendEmail) {
      const alertRequestUpdate = {
        success: { body: `Email confirmation sent to ${patient.getFullName()}` },
        error: { body: `Request failed for ${patient.getFullName()} Failed` },
      };
      const { requestModel: requestId } = selectedAppointment;
      this.props
        .updateEntityRequest({
          url: `/api/requests/${requestId.get('id')}/confirm/${this.state.selectedApp.id}`,
          values: {},
          alert: alertRequestUpdate,
        })
        .then(() => {
          reinitializeState();
        });
    } else {
      const alertRequestUpdate = {
        success: { body: `Request updated for ${patient.getFullName()}` },
        error: { body: `Request failed for ${patient.getFullName()} Failed` },
      };
      this.props
        .updateEntityRequest({
          key: 'requests',
          model: selectedAppointment.requestModel,
          alert: alertRequestUpdate,
        })
        .then(() => reinitializeState());
    }
  }

  render() {
    const {
      patients,
      selectedAppointment,
      setCurrentDay,
      setSendEmail,
      sendEmail,
      timezone,
    } = this.props;

    if (!selectedAppointment) {
      return null;
    }

    const { selectedApp } = this.state;

    const patient = patients.get(selectedAppointment.patientId);
    const appointments = selectedAppointment.nextAppt;

    const pluralize = pluralMap(appointments.length);

    return !sendEmail ? (
      <div className={styles.container}>
        <div className={styles.text}>
          <span>
            {`It seems like
            ${pluralize('an')}
            ${pluralize('appointment')}
            ${pluralize('was')}
            already created for:`}
          </span>
          <div className={styles.userCard}>
            <SHeader className={styles.header}>
              <Avatar user={patient} size="xs" />
              <div className={styles.header_text}>
                {patient.firstName} {patient.lastName}
              </div>
            </SHeader>
            <div className={styles.container}>
              {patient.cellPhoneNumber && (
                <div className={styles.data}>
                  <Icon icon="phone" size={0.9} type="solid" />
                  <div className={styles.data_text}>
                    {formatPhoneNumber(patient.cellPhoneNumber)}
                  </div>
                </div>
              )}
              {patient.email && (
                <div className={styles.data}>
                  <Icon icon="envelope" size={0.9} type="solid" />
                  <div className={styles.data_text}>{patient.email}</div>
                </div>
              )}
              {!patient.cellPhoneNumber && !patient.email && <div className={styles.data}>n/a</div>}
            </div>
          </div>

          {appointments.length > 1 ? (
            <span>
              <br />
              Select one of these appointments to <span className={styles.bold}>Connect</span> with
              this request or simply <span className={styles.bold}>Create New Appointment</span> to
              add a new one.
            </span>
          ) : (
            <span>
              <br />
              Would you like to connect the appointment request with this appointment?
            </span>
          )}
        </div>
        <div className={styles.containerApp}>
          <div className={styles.sameAppList}>
            {appointments.map(app => (
              <SameAppointment
                key={app.id}
                patient={patient}
                appointment={app}
                confirmRequest={this.confirmRequest}
                createAppointment={this.createAppointment}
                setCurrentDay={setCurrentDay}
                setSelected={this.setSelected}
                selectedApp={this.state.selectedApp}
                length={appointments.length}
                timezone={timezone}
              />
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button border="blue" onClick={this.createAppointment}>
            Create New Appointment
          </Button>
          <Button
            color={selectedApp ? 'blue' : 'grey'}
            style={{ cursor: selectedApp ? 'pointer' : 'not-allowed' }}
            className={styles.buttonContainer_yes}
            onClick={() => {
              if (!selectedApp) return null;

              if (window.confirm('Are you sure this is the correct Appointment?')) {
                this.setSelected(selectedApp);
                return setSendEmail();
              }
              return null;
            }}
          >
            Connect Appointment
          </Button>
        </div>
      </div>
    ) : (
      <SendConfirmationEmail
        selectedApp={selectedApp}
        confirmRequest={this.confirmRequest}
        patient={patient}
        length={appointments.length}
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
  setCurrentDay: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  setSendEmail: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

ConfirmAppointmentRequest.defaultProps = {
  redirect: null,
  selectedAppointment: null,
};

function mapStateToProps({ auth }) {
  return {
    timezone: auth.get('timezone'),
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
