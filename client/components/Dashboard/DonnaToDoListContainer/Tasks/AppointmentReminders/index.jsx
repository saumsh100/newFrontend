import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import classnames from 'classnames';
import { sortAsc } from '../../../../../util/isomorphic';
import patientShape from '../../../../library/PropTypeShapes/patient';
import { List, ListItem, Icon, Avatar, getFormattedDate } from '../../../../library';
import PatientPopover from '../../../../library/PatientPopover';
import AppointmentPopover from '../../../../library/AppointmentPopover';
import styles from '../../../styles';

const sortPatientAppointmentsByStartdate = (
  { appointment: { startDate: a } },
  { appointment: { startDate: b } },
) => sortAsc(a, b);

// eslint-disable-next-line react/prop-types
const componentMapper = ({ poc, primaryTypes, timezone, reminder, sendDate, appointments }) => {
  const primaryTypeText = primaryTypes.join(' & ');
  const pocKey = `${poc.id}-${primaryTypeText}-${reminder.interval}`;

  return (
    <ListItem
      className={classnames(styles.appointmentReminder_listItem, styles.appointmentReminder_border)}
      key={pocKey}
    >
      {appointments.sort(sortPatientAppointmentsByStartdate).map((pat, i, array) => {
        const apptKey = `${pocKey}-${pat.appointment.id}`;
        const { isPatientConfirmed } = pat.appointment;
        const { iconContainer, iconActive, flexStart, avatar } = styles;
        const iconClass = classnames(iconContainer, { [iconActive]: isPatientConfirmed });
        const avatarClass = classnames(styles.tasks_avatar, avatar, {
          [flexStart]: array.length > 1,
        });
        return (
          <div
            className={classnames(styles.appointmentReminder_listItemWrapper, {
              [styles.appointmentReminder_single]: array.length === 1,
            })}
            key={apptKey}
          >
            <div className={avatarClass}>{i === 0 && <Avatar size="sm" user={poc} />}</div>
            <div className={classnames(styles.tasks_col, styles.appointmentReminder_center)}>
              {i === 0 && (
                <span className={styles.appointmentReminder_flexStart}>
                  <PatientPopover patient={poc}>
                    <div>{`${poc.firstName} ${poc.lastName}`}</div>
                  </PatientPopover>
                  <div
                    className={classnames(
                      styles.appointmentReminder_muted,
                      styles.appointmentReminder_lowercase,
                      styles.appointmentReminder_contactAt,
                    )}
                  >
                    {`at ${getFormattedDate(sendDate, 'h:mm a', timezone)}`}
                  </div>
                </span>
              )}
            </div>
            <div className={classnames(styles.tasks_smallCol, styles.appointmentReminder_center)}>
              {i === 0 && (
                <span className={styles.appointmentReminder_flexStart}>
                  <div
                    className={styles.appointmentReminder_reminderinterval}
                  >{`${reminder.interval}`}</div>
                  <div
                    className={classnames(
                      styles.appointmentReminder_muted,
                      styles.appointmentReminder_lowercase,
                      styles.appointmentReminder_type,
                    )}
                  >
                    {`${primaryTypeText === 'phone' ? 'voice' : primaryTypeText}`}
                  </div>
                </span>
              )}
            </div>
            <div className={classnames(styles.appointmentReminder_center, styles.tasks_col)}>
              <PatientPopover patient={pat}>
                <span>{`${pat.firstName} ${pat.lastName}`}</span>
              </PatientPopover>
            </div>
            <div className={classnames(styles.tasks_col, styles.appointmentReminder_center)}>
              <AppointmentPopover patient={pat} appointment={pat.appointment}>
                <span className={styles.appointmentReminder_dateAndTime}>
                  {getFormattedDate(pat.appointment.startDate, 'MMM Do - h:mm A', timezone)}
                </span>
              </AppointmentPopover>
              {isPatientConfirmed && (
                <span
                  className={classnames(iconClass, {
                    [styles.appointmentReminder_fakeIcon]: !pat.appointment.isPatientConfirmed,
                  })}
                >
                  {pat.appointment.isPatientConfirmed && (
                    <Icon icon="check" className={styles.appointmentReminder_icon} />
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </ListItem>
  );
};

const appointmentMapper =
  ({ timezone }) =>
  ({ patient, reminder, dependants, primaryTypes, sendDate }) => ({
    poc: patient,
    primaryTypes,
    reminder,
    sendDate,
    timezone,
    appointments: [patient, ...dependants].filter(({ appointment }) => appointment),
  });

export default function AppointmentReminders({ reminders, timezone }) {
  const toRender = orderBy(reminders, 'sendDate')
    .map(appointmentMapper({ timezone }))
    .map(componentMapper);

  return (
    <List className={styles.appointmentReminder_list}>
      {toRender.map((component) => component)}
    </List>
  );
}

AppointmentReminders.propTypes = {
  reminders: PropTypes.arrayOf(
    PropTypes.shape({
      patient: PropTypes.shape(patientShape),
      primaryTypes: PropTypes.arrayOf(PropTypes.string),
      sendDate: PropTypes.string,
    }),
  ),
  timezone: PropTypes.string.isRequired,
};

AppointmentReminders.defaultProps = { reminders: [] };
