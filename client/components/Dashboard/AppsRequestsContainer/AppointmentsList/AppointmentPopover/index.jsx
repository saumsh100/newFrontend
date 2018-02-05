
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  Avatar,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Button,
  TextArea,
} from '../../../../library';
import { FormatPhoneNumber } from '../../../../library/util/Formatters';
import styles from './styles.scss';

export default function AppointmentPopover(props) {
  const {
    patient,
    appointment,
    age,
    practitioner,
    chair,
  } = props;

  const {
    startDate,
    endDate,
    note,
  } = appointment;

  const appointmentDate = moment(startDate).format('dddd LL');
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  const textAreaTheme = {
    group: styles.textAreaGroup,
  };

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
            onClick={props.closePopover}
          >
            <Icon icon="times" />
          </div>
        </SHeader>
        <SBody className={styles.body} >
          <div className={styles.container}>
            <div className={styles.subHeader}>
              Date
            </div>
            <div className={styles.data}>
              {appointmentDate}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              Time
            </div>
            <div className={styles.data}>
              {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
            </div>
          </div>

          {patient.mobilePhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Patient Info
              </div>

              <div className={styles.data}>
                {patient.mobilePhoneNumber ?
                  <Icon icon="phone" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient.mobilePhoneNumber && patient.mobilePhoneNumber[0] === '+' ?
                    FormatPhoneNumber(patient.mobilePhoneNumber) : patient.mobilePhoneNumber}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>) : (
              <div className={styles.container}>
                <div className={styles.subHeader}>
                  Patient Info
                </div>
                <div className={styles.data}>
                  n/a
                </div>
              </div>
          )}

          <div className={styles.container}>
            <div className={styles.subHeader}>
              Practitioner
            </div>
            <div className={styles.data}>
              {practitioner.firstName} {practitioner.lastName}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              Chair
            </div>
            <div className={styles.data}>
              {chair.name}
            </div>
          </div>

          {note ? (<div className={styles.container}>
            <div className={styles.subHeader}>
              Note
            </div>
            <div className={styles.data}>
              <div className={styles.data_note}>
                <TextArea disabled="disabled" theme={textAreaTheme}>{note}</TextArea>
              </div>
            </div>
          </div>) : null}
        </SBody>

        <SFooter className={styles.footer}>
          <Button
            border="blue"
            onClick={props.closePopover}
            dense
            compact
          >
            Close
          </Button>
          <Button
            color="blue"
            onClick={() => { props.handleEditAppointment(appointment.id) }}
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
  patient: PropTypes.object,
  appointment: PropTypes.object,
  age: PropTypes.number,
  closePopover: PropTypes.func,
  editAppointment: PropTypes.func,
  scheduleView: PropTypes.string,
};