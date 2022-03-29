import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from '../../styles';
import Patient from '../../../../entities/collections/patients';
import Appointment from '../../../../entities/collections/appointments';
import Practitioner from '../../../../entities/collections/practitioners';
import { Icon, getTodaysDate, getFormattedDate } from '../../../library';

function PatientData(props) {
  const { patient, appointment, practitioner, timezone } = props;

  const age = getTodaysDate(timezone).diff(patient.birthDate, 'years') || '';
  const lastName = age ? `${patient.lastName},` : patient.lastName;
  return (
    <div className={styles.appPatientContainer}>
      <div className={styles.appPatientData}>
        <div className={styles.patientName}>
          {patient.firstName} {lastName} {age}
        </div>

        <div className={styles.patientDetails}>
          <div className={styles.patientDetails_data}>{practitioner.getPrettyName()}</div>
        </div>
        <div className={styles.patientDetails}>
          <span className={styles.patientDetails_lastAppt}>Last Appt:&nbsp;</span>
          <span className={styles.patientDetails_date}>
            {patient.lastApptDate
              ? getFormattedDate(patient.lastApptDate, ' MMM D, YYYY', timezone)
              : ' n/a'}
          </span>
        </div>
      </div>

      <div className={styles.appPatientConfirmed}>
        {appointment.isPatientConfirmed ? (
          <div className={styles.iconContainer}>
            <Icon icon="check" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

PatientData.propTypes = {
  patient: PropTypes.shape(Patient).isRequired,
  appointment: PropTypes.shape(Appointment).isRequired,
  practitioner: PropTypes.shape(Practitioner).isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(PatientData);
