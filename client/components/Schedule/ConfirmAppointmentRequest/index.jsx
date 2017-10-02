import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Avatar } from '../../library';
import { updateEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class ConfirmAppointmentRequest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      patients,
      appointments,
      selectedAppointment,
      reinitializeState,
    } = this.props;

    if (!selectedAppointment) {
      return null;
    }

    const patient = patients.get(selectedAppointment.patientId);
    const appointment = appointments.get(selectedAppointment.nextAppt);
    const startDate = moment(appointment.get('startDate'));
    const endDate = moment(appointment.get('endDate'));

    return (
      <div className={styles.container}>
        <div className={styles.test}>It seems like an appointment was already created for {patient.get('firstName')} on {
          startDate.format('MMMM Do, YYYY h:ma')}</div>
        <div>
          <div>
            <Avatar user={patient} />
          </div>
          <div>
            <div>{patient.getFullName()}</div>
            <div>{startDate.format('h:mm')} - {endDate.format('h:mma')}</div>
            <span>
              <div>{patient.get('email'}</div>
              <div>{patient.get('mobilePhoneNumber')}</div>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

ConfirmAppointmentRequest.propTypes = {
  updateEntityRequest: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
};

const enhance = connect(null, mapDispatchToProps);

export default enhance(ConfirmAppointmentRequest);
