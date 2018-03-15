
import React from 'react';
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
} from '../index.js';
import styles from './styles.scss';
import { formatPhoneNumber } from '../../library/util/Formatters';

export default function AppointmentInfo(props) {
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
    <Card className={styles.card} noBorder >
      <SContainer>
        <SHeader className={styles.header}>
          <Icon icon="calendar" size={1.5} />
          <div className={styles.header_text}>
            {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
          </div>
          <div
            className={styles.closeIcon}
            onClick={()=>props.closePopover()}
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
              Name
            </div>
            <div className={styles.data}>
              {patient.firstName} {lastName} {age}
            </div>
          </div>

          {patient.mobilePhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Contact Info
              </div>

              <div className={styles.data}>
                {patient.mobilePhoneNumber ?
                  <Icon icon="phone" size={0.9} type="solid"/> : null}
                <div className={styles.data_text}>
                  {patient.mobilePhoneNumber && patient.mobilePhoneNumber[0] === '+' ?
                    formatPhoneNumber(patient.mobilePhoneNumber) : patient.mobilePhoneNumber}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} type="solid"/> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>
                Contact Info
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
            dense
            compact
            onClick={()=>props.closePopover()}
          >
            Close
          </Button>
          <Button
            color="blue"
            dense
            compact
            className={styles.editButton}
            onClick={() => props.editAppointment()}
          >
            Edit
          </Button>
        </SFooter>
      </SContainer>
    </Card>
  )
}
