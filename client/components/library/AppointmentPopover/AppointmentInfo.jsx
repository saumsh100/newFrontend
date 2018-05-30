
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Button,
  TextArea,
  IconButton,
} from '../index.js';
import { formatPhoneNumber } from '../../library/util/Formatters';
import { patientShape, chairShape, practitionerShape } from '../PropTypeShapes/index';
import styles from './styles.scss';

const popoverDataSections = (subHeaderText, data) => (
  <div className={styles.container}>
    <div className={styles.subHeader}>{subHeaderText}</div>
    <div className={styles.data}>{data}</div>
  </div>
);

export default function AppointmentInfo(props) {
  const { patient, appointment, age, practitioner, chair } = props;

  const { startDate, endDate, note } = appointment;

  const appointmentDate = moment(startDate).format('dddd LL');
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  const textAreaTheme = {
    group: styles.textAreaGroup,
  };

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Icon icon="calendar" size={1.5} />
          <div className={styles.header_text}>
            {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
          </div>
          <div className={styles.closeIcon}>
            <IconButton icon="times" onClick={() => props.closePopover()} />
          </div>
        </SHeader>
        <SBody className={styles.body}>
          {popoverDataSections('Date', appointmentDate)}
          {popoverDataSections('Name', `${patient.firstName} ${lastName} ${age}`)}

          {patient.mobilePhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Contact Info</div>

              <div className={styles.data}>
                {patient.mobilePhoneNumber ? <Icon icon="phone" size={0.9} type="solid" /> : null}
                <div className={styles.data_text}>
                  {patient.mobilePhoneNumber && patient.mobilePhoneNumber[0] === '+'
                    ? formatPhoneNumber(patient.mobilePhoneNumber)
                    : patient.mobilePhoneNumber}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} type="solid" /> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>
          ) : (
            popoverDataSections('Contact Info', 'n/a')
          )}

          {popoverDataSections(
            'Practitioner',
            `${practitioner.firstName} ${practitioner.lastName}`
          )}

          {chair && popoverDataSections('Chair', chair.name)}

          {note &&
            popoverDataSections(
              'Note',
              <div className={styles.data_note}>
                <TextArea disabled="disabled" theme={textAreaTheme}>
                  {note}
                </TextArea>
              </div>
            )}
        </SBody>

        <SFooter className={styles.footer}>
          <Button border="blue" dense compact onClick={() => props.closePopover()}>
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
  );
}

AppointmentInfo.propTypes = {
  editAppointment: PropTypes.func,
  closePopover: PropTypes.func,
  age: PropTypes.number,
  practitioner: PropTypes.shape(practitionerShape),
  patient: PropTypes.shape(patientShape),
  chair: PropTypes.shape(chairShape),
  appointment: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    note: PropTypes.string,
  }),
};
