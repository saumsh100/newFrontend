
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import orderBy from 'lodash/orderBy';
import patientShape from '../../../../library/PropTypeShapes/patient';
import { List, ListItem, Avatar } from '../../../../library';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function AppointmentReminders({ reminders, timezone }) {
  return (
    <List className={styles.list}>
      {orderBy(reminders, 'sendDate').map((reminder) => {
        const { patient, primaryTypes, sendDate } = reminder;

        const { appointment } = patient;

        return (
          <ListItem className={styles.listItem} key={`appointmentReminders_${appointment.id}`}>
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.smallCol}>{primaryTypes.join(' & ')}</div>
            <div className={styles2.smallCol}>{moment.tz(sendDate, timezone).format('h:mm A')}</div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {moment.tz(appointment.startDate, timezone).format('MMM Do, YYYY - h:mm A')}
            </div>
            <div className={styles2.smallCol}>{appointment.isPatientConfirmed ? 'YES' : 'NO'}</div>
          </ListItem>
        );
      })}
    </List>
  );
}

AppointmentReminders.propTypes = {
  reminders: PropTypes.arrayOf(PropTypes.shape({
    patient: PropTypes.shape(patientShape),
    primaryTypes: PropTypes.arrayOf(PropTypes.string),
    sendDate: PropTypes.string,
  })),
  timezone: PropTypes.string.isRequired,
};

AppointmentReminders.defaultProps = {
  reminders: [],
};
