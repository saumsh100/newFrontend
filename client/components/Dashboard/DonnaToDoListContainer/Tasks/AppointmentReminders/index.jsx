
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import {
  List,
  ListItem,
  Avatar
} from '../../../../library';
import styles from './styles.scss';
import styles2 from '../styles.scss';

export default function AppointmentReminders({ reminders }) {
  return (
    <List className={styles.list}>
      {orderBy(reminders, 'sendDate').map((reminder) => {
        const {
          patient,
          primaryTypes,
          sendDate,
        } = reminder;

        const {
          appointment,
        } = patient;

        return (
          <ListItem className={styles.listItem}>
            <div className={styles2.avatar}>
              <Avatar size="sm" user={patient} />
            </div>
            <div className={styles2.smallCol}>
              {primaryTypes.join(' & ')}
            </div>
            <div className={styles2.smallCol}>
              {moment(sendDate).format('h:mm A')}
            </div>
            <div className={styles2.col}>
              {patient.firstName} {patient.lastName}
            </div>
            <div className={styles2.col}>
              {moment(appointment.startDate).format('MMM Do, YYYY - h:mm A')}
            </div>
            <div className={styles2.smallCol}>
              {appointment.isPatientConfirmed ? 'YES' : 'NO'}
            </div>
          </ListItem>
        );
      })}

    </List>
  );
}


AppointmentReminders.propTypes = {
};
