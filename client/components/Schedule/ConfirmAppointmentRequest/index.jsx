import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Button, Icon } from '../../library';
import SameAppointment from './SameAppointment';
import styles from './styles.scss';
import SendConfirmationEmail from "./SendConfirmationEmail";

class ConfirmAppointmentRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedApp: null,
    };

    this.confirmRequest = this.confirmRequest.bind(this);
    this.createAppointment = this.createAppointment.bind(this);
    this.setSelected = this.setSelected.bind(this);
  }

  confirmRequest(patient, sendEmail) {
    const {
      selectedAppointment,
      updateEntityRequest,
      reinitializeState,
    } = this.props;

    if (sendEmail) {
      const alertRequestUpdate = {
        success: {
          body: `Email confirmation sent to ${patient.getFullName()}`,
        },
        error: {
          body: `Request failed for ${patient.get('firstName')} Failed`,
        },
      };
      const requestId = selectedAppointment.requestId;
      this.props.updateEntityRequest({
        url: `/api/requests/${requestId}/confirm/${this.state.selectedApp['id']}`,
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
      updateEntityRequest({
        key: 'requests',
        model: selectedAppointment.requestModel,
        alert: alertRequestUpdate,
      }).then(() => reinitializeState());
    }
  }

  createAppointment() {
    const modifiedAppointment = this.props.selectedAppointment;
    modifiedAppointment.nextAppt = false;
    this.props.reinitializeState();
    this.props.selectAppointment(modifiedAppointment);
  }

  setSelected(app) {
    this.setState({
      selectedApp: app,
    });
  }

  render() {
    const {
      patients,
      selectedAppointment,
      setCurrentDay,
      setSendEmail,
      sendEmail,
    } = this.props;

    if (!selectedAppointment) {
      return null;
    }

    const {
      selectedApp,
    } = this.state;

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
            {patient.get('firstName')} on {startDate.format('MMMM Do, YYYY')} from {startDate.format('h:mma')} - {endDate.format('h:mma')}.
          </div>
          <br />
          Would you like to connect the appointment request with this appointment?
        </div>
      );
    } else {
      displayText = (
        <div className={styles.text}>It seems like a few appointments were already created for
          <span className={styles.listItemHeader}> {patient.get('firstName')}.</span>
          <br />
          Would you like to connect the appointment request with one of these appointments?
        </div>
      )
    }

    return (
      <div>
        {!sendEmail ? (
          <div className={styles.container}>
            {displayText}
            {appointments.map((app) => {
              return (<SameAppointment
                key={app.id}
                patient={patient}
                appointment={app}
                confirmRequest={this.confirmRequest}
                createAppointment={this.createAppointment}
                setCurrentDay={setCurrentDay}
                setSelected={this.setSelected}
                selectedApp={this.state.selectedApp}
              />);
            })}
            {appointments.length === 1 ? (
              <div className={styles.buttonContainer}>
                <Button
                  icon="times"
                  color="darkgrey"
                  onClick={() => this.createAppointment()}
                >
                  No
                </Button>
                <Button
                  icon="check"
                  tertiary
                  onClick={() => {
                    if (confirm('Are you sure this is the correct Appointment?')) {
                      this.setSelected(appointments[0]);
                      return setSendEmail();
                    }
                  }}
                >
                  Yes
                </Button>
              </div>) : (
                <div className={styles.buttonContainer}>
                  <Button
                    icon="times"
                    color="darkgrey"
                    onClick={() => this.createAppointment()}
                  >
                    No
                  </Button>
                  <Button
                    icon="check"
                    style={{ cursor: selectedApp ? 'pointer' : 'not-allowed' }}
                    color={selectedApp ? 'green' : 'grey'}
                    onClick={() => {
                      if (selectedApp) {
                        return confirm('Are you sure this is the correct Appointment?') ? setSendEmail() : null;
                      }
                    }}
                  >
                    Yes
                  </Button>
                </div>)}
          </div>) : (
            <SendConfirmationEmail
              selectedApp={selectedApp}
              confirmRequest={this.confirmRequest}
              patient={patient}
            />)}
      </div>
    );
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
