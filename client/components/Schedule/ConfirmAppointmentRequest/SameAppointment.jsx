
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { Icon, Button } from '../../library';
import { appointmentShape } from '../../library/PropTypeShapes';
import Patient from '../../../entities/models/Patient';
import styles from './styles.scss';

const SameAppointment = (props) => {
  const {
    patient, appointment, setSelected, selectedApp,
  } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = moment(appointment.startDate);
  const endDate = moment(appointment.endDate);

  return (
    <Button
      className={classNames(styles.dataContainer, styles.singleItem, {
        [styles.appointmentIsSelected]:
          appointment.id === (selectedApp && selectedApp.id),
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
            Created At:{' '}
            {moment(appointment.createdAt).format('MMMM Do, YYYY h:mm A')}
          </div>
        </div>
      </div>
    </Button>
  );
};

SameAppointment.propTypes = {
  patient: PropTypes.instanceOf(Patient),
  appointment: PropTypes.shape(appointmentShape),
  setSelected: PropTypes.func,
  selectedApp: PropTypes.shape(appointmentShape),
};

export default SameAppointment;
