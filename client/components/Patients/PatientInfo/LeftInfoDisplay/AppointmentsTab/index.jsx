
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '../../../../library';
import ContinuingCareSection from './ContinuingCareSection';
import LastAppointmentSection from './LastAppointmentSection';
import styles from '../styles.scss';

export default function AppointmentsTab(props) {
  const { patient } = props;
  return (
    <Grid className={styles.grid}>
      <ContinuingCareSection patient={patient} className={styles.continuingCareSection} />
      <LastAppointmentSection patient={patient} />
    </Grid>
  );
}

AppointmentsTab.propTypes = {
  patient: PropTypes.shape({
    lastRestorativeDate: PropTypes.string,
    lastRecallDate: PropTypes.string,
    lastHygieneDate: PropTypes.string,
  }).isRequired,
};
