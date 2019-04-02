
import React from 'react';
import PropTypes from 'prop-types';
import ContactSection from '../../PatientInfo/LeftInfoDisplay/PersonalTab/ContactSection';
import LastAppointmentSection from '../../PatientInfo/LeftInfoDisplay/AppointmentsTab/LastAppointmentSection';
import { patientShape } from '../../../library/PropTypeShapes/index';
import styles from './styles.scss';

export default function PatientInfoSection(props) {
  const { patient } = props;
  return (
    <div className={styles.grid}>
      <ContactSection patient={patient} />
      <LastAppointmentSection patient={patient} className={styles.lastAppointmentSection} />
    </div>
  );
}

PatientInfoSection.propTypes = { patient: PropTypes.shape(patientShape).isRequired };
