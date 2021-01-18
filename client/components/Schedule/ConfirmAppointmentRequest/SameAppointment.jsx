
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Icon,
  Button,
  getUTCDate,
  getFormattedTime,
  Avatar,
  SHeader,
  getTodaysDate,
  getFormattedDate,
} from '../../library';
import { appointmentShape } from '../../library/PropTypeShapes';
import Patient from '../../../entities/models/Patient';
import styles from './styles.scss';
import Item from './Item';

const SameAppointment = (props) => {
  const { patient, appointment, setSelected, selectedApp, timezone, apptWrite } = props;

  if (!patient || !appointment) {
    return null;
  }

  const startDate = getUTCDate(appointment.startDate, timezone);
  const endDate = getUTCDate(appointment.endDate, timezone);
  const createdAt = getUTCDate(appointment.createdAt, timezone);
  const birthDate = patient.get('birthDate');
  const age = birthDate ? `, ${getTodaysDate(timezone).diff(birthDate, 'years')}` : '';
  const appointmentDate = getUTCDate(startDate, timezone).format('LL');
  return (
    <Button
      className={classNames(styles.dataContainer, styles.singleItem, {
        [styles.appointmentIsSelected]: appointment.id === (selectedApp && selectedApp.id),
      })}
      onClick={() => {
        setSelected(appointment);
      }}
    >
      {apptWrite ? (
        <React.Fragment>
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
                {getFormattedDate(appointment.createdAt, 'MMMM Do, YYYY h:mm A', timezone)}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className={styles.summaryData}>
          <div className={styles.userCard}>
            <SHeader className={styles.header}>
              <Avatar user={patient} size="xs" />
              <div className={styles.header_text}>
                {patient.firstName} {patient.lastName}
                {age}
              </div>
            </SHeader>
          </div>
          <div className={styles.itemContainer}>
            <Item
              title="DATE"
              index="DATE"
              value={appointmentDate}
              extra={[
                {
                  extraTitle: 'Created at:',
                  extraValue: createdAt.format('LL'),
                },
              ]}
            />
            <Item
              title="TIME"
              index="TIME"
              value={getFormattedTime(startDate, endDate, timezone)}
            />
          </div>
        </div>
      )}
    </Button>
  );
};

SameAppointment.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  setSelected: PropTypes.func.isRequired,
  selectedApp: PropTypes.shape(appointmentShape).isRequired,
  timezone: PropTypes.string.isRequired,
  apptWrite: PropTypes.bool.isRequired,
};

export default SameAppointment;
