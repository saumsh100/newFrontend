
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Button, getUTCDate, getFormattedDate } from '../../library';
import { appointmentShape } from '../../library/PropTypeShapes';
import Patient from '../../../entities/models/Patient';
import styles from './styles.scss';

const SameAppointment = (props) => {
  const { patient, appointment, setSelected, selectedApp, timezone } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = getUTCDate(appointment.startDate, timezone);
  const endDate = getUTCDate(appointment.endDate, timezone);

  return (
    <Button
      className={classNames(styles.dataContainer, styles.singleItem, {
        [styles.appointmentIsSelected]: appointment.id === (selectedApp && selectedApp.id),
      })}
      onClick={() => {
        setSelected(appointment);
      }}
    >
      <div className={styles.avatarContainer}>
        <Icon size={2} icon="calendar" />
      </div>
      <div className={styles.dataContainer_body}>
        <div className={styles.dataContainer_patientInfo}>
          <div className={styles.dataContainer_patientInfo_date}>
            {startDate.format('MMMM Do, YYYY')}
          </div>
          <div className={styles.dataContainer_patientInfo_date}>
            {startDate.format('h:mma')} - {endDate.format('h:mma')}
          </div>
          <div className={styles.dataContainer_patientInfo_createdAt}>
            Created At: {getFormattedDate(appointment.createdAt, 'MMMM Do, YYYY h:mm A', timezone)}
          </div>
        </div>
      </div>
    </Button>
  );
};

SameAppointment.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  setSelected: PropTypes.func.isRequired,
  selectedApp: PropTypes.shape(appointmentShape).isRequired,
  timezone: PropTypes.string.isRequired,
};

export default SameAppointment;
