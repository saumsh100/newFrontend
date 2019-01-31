
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter, formatPhoneNumber } from '@carecru/isomorphic';
import {
  Avatar,
  Button,
  Card,
  Icon,
  SBody,
  SContainer,
  SFooter,
  SHeader,
  TextArea,
} from '../../../../library';
import Patient from '../../../../../entities/collections/patients';
import Appointment from '../../../../../entities/collections/appointments';
import Practitioner from '../../../../../entities/collections/practitioners';
import Chair from '../../../../../entities/collections/chairs';
import styles from './styles.scss';

export default function AppointmentPopover({
  patient,
  appointment,
  age,
  practitioner,
  chair,
  closePopover,
  handleEditAppointment,
}) {
  const { startDate, endDate, note } = appointment;

  const lastName = age ? `${patient.lastName},` : patient.lastName;

  return (
    <Card className={styles.card} noBorder id="appPopOver">
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.header_text}>
            {patient.firstName} {lastName} {age}
          </div>
          <div
            className={styles.closeIcon}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.keyCode === '13' && closePopover}
            onClick={closePopover}
          >
            <Icon icon="times" />
          </div>
        </SHeader>
        <SBody className={styles.body}>
          <div className={styles.container}>
            <div className={styles.subHeader}>Date</div>
            <div className={styles.data}>{dateFormatter(startDate, '', 'dddd LL')}</div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>Time</div>
            <div className={styles.data}>
              {dateFormatter(startDate, '', 'h:mm a')} - {dateFormatter(endDate, '', 'h:mm a')}
            </div>
          </div>

          {patient.cellPhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>

              <div className={styles.data}>
                {patient.cellPhoneNumber && <Icon icon="phone" size={0.9} />}
                <div className={styles.data_text}>
                  {patient.cellPhoneNumber && formatPhoneNumber(patient.cellPhoneNumber)}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email && <Icon icon="envelope" size={0.9} />}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>
              <div className={styles.data}>n/a</div>
            </div>
          )}

          <div className={styles.container}>
            <div className={styles.subHeader}>Practitioner</div>
            <div className={styles.data}>
              {practitioner.firstName} {practitioner.lastName}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>Chair</div>
            <div className={styles.data}>{chair.name}</div>
          </div>

          {note && (
            <div className={styles.container}>
              <div className={styles.subHeader}>Note</div>
              <div className={styles.data}>
                <div className={styles.data_note}>
                  <TextArea disabled="disabled" theme={{ group: styles.textAreaGroup }}>
                    {note}
                  </TextArea>
                </div>
              </div>
            </div>
          )}
        </SBody>

        <SFooter className={styles.footer}>
          <Button border="blue" onClick={closePopover} dense compact>
            Close
          </Button>
          <Button
            color="blue"
            onClick={() => {
              handleEditAppointment(appointment.id);
            }}
            dense
            compact
            className={styles.editButton}
          >
            Edit
          </Button>
        </SFooter>
      </SContainer>
    </Card>
  );
}

AppointmentPopover.propTypes = {
  patient: PropTypes.instanceOf(Patient).isRequired,
  appointment: PropTypes.instanceOf(Appointment).isRequired,
  age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  closePopover: PropTypes.func.isRequired,
  practitioner: PropTypes.arrayOf(PropTypes.instanceOf(Practitioner)).isRequired,
  chair: PropTypes.arrayOf(PropTypes.instanceOf(Chair)).isRequired,
  handleEditAppointment: PropTypes.func.isRequired,
};

AppointmentPopover.defaultProps = { age: null };
