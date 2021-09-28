import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import classnames from 'classnames';
import { sortAsc } from '../../../../../util/isomorphic';
import patientShape from '../../../../library/PropTypeShapes/patient';
import { List, ListItem, Icon, Avatar, getFormattedDate } from '../../../../library';
import PatientPopover from '../../../../library/PatientPopover';
import AppointmentPopover from '../../../../library/AppointmentPopover';
import styles from './styles.scss';
import styles2 from '../styles.scss';

const sortPatientAppointmentsByStartdate = (
  { appointment: { startDate: a } },
  { appointment: { startDate: b } },
) => sortAsc(a, b);

// eslint-disable-next-line react/prop-types
const componentMapper = ({ poc, primaryTypes, timezone, reminder, sendDate, appointments }) => {
  const primaryTypeText = primaryTypes.join(' & ');
  const pocKey = `${poc.id}-${primaryTypeText}-${reminder.interval}`;

  return (
    <ListItem className={classnames(styles.listItem, styles.border)} key={pocKey}>
      {appointments.sort(sortPatientAppointmentsByStartdate).map((pat, i, array) => {
        const apptKey = `${pocKey}-${pat.appointment.id}`;
        const { isPatientConfirmed } = pat.appointment;
        const { iconContainer, iconActive, flexStart, avatar } = styles;
        const iconClass = classnames(iconContainer, { [iconActive]: isPatientConfirmed });
        const avatarClass = classnames(styles2.avatar, avatar, { [flexStart]: array.length > 1 });
        return (
          <div
            className={classnames(styles.listItemWrapper, { [styles.single]: array.length === 1 })}
            key={apptKey}
          >
            <div className={avatarClass}>{i === 0 && <Avatar size="sm" user={poc} />}</div>
            <div className={classnames(styles2.col, styles.flexStart)}>
              {i === 0 && (
                <span>
                  <PatientPopover patient={poc}>
                    <div>{`${poc.firstName} ${poc.lastName}`}</div>
                  </PatientPopover>
                  <div className={classnames(styles.muted, styles.lowercase)}>
                    {`at ${getFormattedDate(sendDate, 'h:mm a', timezone)}`}
                  </div>
                </span>
              )}
            </div>
            <div className={classnames(styles2.smallCol, styles.flexStart)}>
              {i === 0 && (
                <span>
                  <div>{`${reminder.interval}`}</div>
                  <div className={classnames(styles.muted, styles.lowercase)}>
                    {`${primaryTypeText === 'phone' ? 'voice' : primaryTypeText}`}
                  </div>
                </span>
              )}
            </div>
            <div className={classnames(styles.flexStart, styles2.col)}>
              <PatientPopover patient={pat}>
                <span>{`${pat.firstName} ${pat.lastName}`}</span>
              </PatientPopover>
            </div>
            <div className={classnames(styles2.col, styles.flexStart)}>
              <AppointmentPopover patient={pat} appointment={pat.appointment}>
                <span>
                  {getFormattedDate(pat.appointment.startDate, 'MMM Do - h:mm A', timezone)}
                </span>
              </AppointmentPopover>
              <span className={iconClass}>
                {pat.appointment.isPatientConfirmed && (
                  <Icon icon="check" style={{ 'font-size': '10px' }} />
                )}
              </span>
            </div>
          </div>
        );
      })}
    </ListItem>
  );
};

const appointmentMapper = ({ timezone }) => ({
  patient,
  reminder,
  dependants,
  primaryTypes,
  sendDate,
}) => ({
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

  return <List className={styles.list}>{toRender.map((component) => component)}</List>;
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
