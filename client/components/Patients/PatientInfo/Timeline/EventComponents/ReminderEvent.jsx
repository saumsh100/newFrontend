import React from 'react';
import PropTypes from 'prop-types';
import EventContainer from './Shared/EventContainer';
import { getFormattedDate, PatientPopover } from '../../../../library';
import styles from './styles.scss';

const getFirstAppointmentFromSentRemindersPatients = (sentRemindersPatients) => {
  const firstAppointmentDate = new Date(
    Math.min(
      ...sentRemindersPatients.map((sentReminderPatient) => {
        const {
          appointment: { startDate: beginFirstApptDate },
        } = sentReminderPatient;

        if (sentReminderPatient?.appointmentStartDate) {
          return new Date(sentReminderPatient.appointmentStartDate);
        }
        return new Date(beginFirstApptDate);
      }),
    ),
  );
  return firstAppointmentDate.toISOString();
};

const renderFamilyDetails = (data, timezone) => {
  const { contactedPatientId, sentRemindersPatients } = data;

  const patientFullName = ({ firstName, lastName }) => <span>{` ${firstName} ${lastName} `}</span>; // eslint-disable-line react/prop-types

  if (sentRemindersPatients.length === 1) {
    const {
      patient,
      appointment: { startDate },
    } = sentRemindersPatients[0];
    const appDateTime = getFormattedDate(startDate, 'MMMM Do, YYYY h:mma', timezone);
    return (
      <span>
        Family Reminder for{' '}
        <PatientPopover patient={patient} patientStyles={styles.reminder_patientNameStyle}>
          {patientFullName(patient)}
        </PatientPopover>{' '}
        for the appointment on {appDateTime}.
      </span>
    );
  }

  return (
    <span>
      Family Reminder for these appointments:
      <div className={styles.reminder_container}>
        {sentRemindersPatients.map(({ patient, appointment: { startDate } }) => {
          const appDate = getFormattedDate(startDate, 'MMMM Do, YYYY', timezone);
          const appTime = getFormattedDate(startDate, 'h:mma', timezone);

          return (
            <div className={styles.reminder_body}>
              <div className={styles.flexRow}>
                <div className={styles.reminder_appDetails}>
                  <div className={styles.reminder_name}>
                    {patient.id !== contactedPatientId ? (
                      <PatientPopover patient={patient}>{patientFullName(patient)}</PatientPopover>
                    ) : (
                      patientFullName(patient)
                    )}
                  </div>
                  <div className={styles.reminder_appDate}>
                    <div className={styles.flexCol}>
                      <div className={styles.reminder_appDateHeaders}>
                        <div> Date:</div>
                        <div> Time:</div>
                      </div>
                    </div>
                    <div className={styles.flexCol}>
                      <div> {appDate}</div>
                      <div> {appTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </span>
  );
};

export default function ReminderEvent({ data, timezone, smsFailed, patient }) {
  const contactMethodHash = {
    email: 'Email',
    sms: 'SMS',
    'sms/email': 'Email & SMS',
    smart_follow_up: 'Smart Follow Up',
  };
  const contactMethod = contactMethodHash[data.primaryType];
  const contactNumber = patient?.cellPhoneNumber || 'cell phone number';
  const intervalText = <span className={styles.reminder_interval}>{data.reminder.interval}</span>;
  const { sentRemindersPatients } = data;

  const firstAppointmentStartDate =
    getFirstAppointmentFromSentRemindersPatients(sentRemindersPatients);

  const appDate = getFormattedDate(firstAppointmentStartDate, 'MMMM Do, YYYY h:mma', timezone);

  const showReminderMessage = smsFailed
    ? `Reminder for the appointment on ${appDate} failed as ${contactNumber} does not support ${contactMethod}`
    : `Reminder for the appointment on ${appDate}`;

  const component = (
    <div className={styles.body_header}>
      Sent &#39;
      {intervalText} Before &#39; {contactMethod}{' '}
      {data.isFamily ? renderFamilyDetails(data, timezone) : showReminderMessage}
    </div>
  );

  return <EventContainer key={data.id} component={component} />;
}

ReminderEvent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    isConfirmed: PropTypes.bool,
    isFamily: PropTypes.bool,
    primaryType: PropTypes.string,
    reminder: PropTypes.shape({ interval: PropTypes.string }),
    sentRemindersPatients: PropTypes.shape({
      sentRemindersId: PropTypes.string,
      appointment: PropTypes.shape({
        id: PropTypes.string,
        startDate: PropTypes.string,
      }),
    }),
  }).isRequired,
  timezone: PropTypes.string.isRequired,
  smsFailed: PropTypes.bool,
  patient: PropTypes.shape({
    cellPhoneNumber: PropTypes.string,
  }).isRequired,
};
ReminderEvent.defaultProps = {
  smsFailed: false,
};
