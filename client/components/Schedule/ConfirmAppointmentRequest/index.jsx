
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Map } from 'immutable';
import { selectAppointmentPropType } from '../index';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Button } from '../../library';
import SameAppointment from './SameAppointment';
import styles from './styles.scss';
import SendConfirmationEmail from './SendConfirmationEmail';

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
    this.setState({
      selectedApp: app,
    });
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
        success: {
          body: `Email confirmation sent to ${patient.getFullName()}`,
        },
        error: {
          body: `Request failed for ${patient.get('firstName')} Failed`,
        },
      };
      const requestId = selectedAppointment.requestModel;
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
        success: {
          body: `Request updated for ${patient.getFullName()}`,
        },
        error: {
          body: `Request failed for ${patient.get('firstName')} Failed`,
        },
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
    const { patients, selectedAppointment, setCurrentDay, setSendEmail, sendEmail } = this.props;

    if (!selectedAppointment) {
      return null;
    }

    const { selectedApp } = this.state;

    const patient = patients.get(selectedAppointment.patientId);
    const appointments = selectedAppointment.nextAppt;

    let displayText = '';

    if (appointments.length === 1) {
      const startDate = moment(appointments[0].startDate);
      const endDate = moment(appointments[0].endDate);
      displayText = (
        <div className={styles.text}>
          It seems like an appointment was already created for
          <div className={styles.listItemHeader}>
            {patient.get('firstName')} on {startDate.format('MMMM Do, YYYY')} from{' '}
            {startDate.format('h:mma')} - {endDate.format('h:mma')}.
          </div>
          <br />
          Would you like to connect the appointment request with this appointment?
        </div>
      );
    } else {
      displayText = (
        <div className={styles.text}>
          It seems like a few appointments were already created for
          <span className={styles.listItemHeader}> {patient.get('firstName')}.</span>
          <br />
          <br />
          If you would like to connect one of these appointments with this request please select one
          now and click <span className={styles.bold}>Yes</span>. Otherwise, you can create a new
          appointment by clicking <span className={styles.bold}>No</span>.
        </div>
      );
    }

    const cursorStyle = { cursor: selectedApp ? 'pointer' : 'not-allowed' };

    return (
      <div>
        {!sendEmail ? (
          <div className={styles.container}>
            {displayText}

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
                  />
                ))}
              </div>
            </div>

            {appointments.length === 1 ? (
              <div className={styles.buttonContainer}>
                <Button border="blue" onClick={this.createAppointment}>
                  No
                </Button>
                <Button
                  color="blue"
                  onClick={() => {
                    // eslint-disable-next-line no-alert
                    if (confirm('Are you sure this is the correct Appointment?')) {
                      this.setSelected(appointments[0]);
                      return setSendEmail();
                    }
                    return null;
                  }}
                >
                  Yes
                </Button>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                <Button border="blue" onClick={() => this.createAppointment()}>
                  No
                </Button>
                <Button
                  style={cursorStyle}
                  color={selectedApp ? 'blue' : 'grey'}
                  className={styles.buttonContainer_yes}
                  onClick={() => {
                    if (!selectedApp) return null;

                    return confirm('Are you sure this is the correct Appointment?') // eslint-disable-line no-alert
                      ? setSendEmail()
                      : null;
                  }}
                >
                  Yes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <SendConfirmationEmail
            selectedApp={selectedApp}
            confirmRequest={this.confirmRequest}
            patient={patient}
            length={appointments.length}
          />
        )}
      </div>
    );
  }
}

ConfirmAppointmentRequest.propTypes = {
  patients: PropTypes.instanceOf(Map),
  redirect: PropTypes.shape({ pathname: PropTypes.string }),
  reinitializeState: PropTypes.func.required,
  selectAppointment: PropTypes.func,
  selectedAppointment: selectAppointmentPropType,
  sendEmail: PropTypes.bool,
  setCurrentDay: PropTypes.func,
  setLocation: PropTypes.func,
  setSendEmail: PropTypes.func,
  updateEntityRequest: PropTypes.func.required,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateEntityRequest,
      setLocation: push,
    },
    dispatch
  );
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(ConfirmAppointmentRequest);
