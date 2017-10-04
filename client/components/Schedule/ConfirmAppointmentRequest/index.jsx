import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import { Button } from '../../library';
import SameAppointment from './SameAppointment';
import CreateAppointment from './CreateAppointment';
import styles from './styles.scss';

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
      selectedAppointment,
      setConfirmState,
      reinitializeState,
      confirmState,
    } = this.props;

    if (!selectedAppointment) {
      return null;
    }

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
          Would you like us to send an appointment confirmation email to
          <span> {patient.get('firstName')}</span>?
        </div>
      );
    } else {
      displayText = (
        <div className={styles.text}>It seems like a few appointments were already created for
          <span className={styles.listItemHeader}> {patient.getFullName()}.</span> If any of these are the same appointment
          as the one requested would you like to send an appointment confirmation email to
          <span> {patient.get('firstName')}</span>?
        </div>
      )
    }

    const displayComponent = confirmState ? (
      <div className={styles.container}>
        {displayText}
        {appointments.map((app) => {
          return (<SameAppointment
            patient={patient}
            appointment={app}
            confirmRequest={this.confirmRequest}
            createAppointment={this.createAppointment}
            setConfirmState={setConfirmState}
          />);
        })}
        <div className={styles.buttonContainer}>
          <Button icon="times" color="darkgrey" onClick={() => setConfirmState()}>
            No
          </Button>
          <Button icon="check" tertiary onClick={() => confirmRequest(patient)}>
            Yes
          </Button>
        </div>
      </div>
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
