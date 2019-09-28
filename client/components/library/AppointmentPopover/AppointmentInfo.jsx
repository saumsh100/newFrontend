
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { formatPhoneNumber } from '@carecru/isomorphic';
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
  PointOfContactBadge,
} from '..';
import { patientShape, appointmentShape, practitionerShape } from '../PropTypeShapes/index';
import ChairModel from '../../../entities/models/Chair';
import EnabledFeature from '../EnabledFeature';
import styles from './styles.scss';

const popoverDataSections = (subHeaderText, data) => (
  <div className={styles.container}>
    <div className={styles.subHeader}>{subHeaderText}</div>
    {typeof data === 'string' ? <div className={styles.data}>{data}</div> : data}
  </div>
);

export default function AppointmentInfo(props) {
  const { patient, appointment, age, practitioner, chair } = props;

  const { startDate, endDate, note } = appointment;

  const appointmentDate = moment(startDate).format('dddd LL');
  const lastName = age ? `${patient.lastName},` : patient.lastName;

  const textAreaTheme = { group: styles.textAreaGroup };

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
          {popoverDataSections(
            'Name',
            <div>
              <a href={props.patientUrl} className={styles.dataLink}>
                {`${patient.firstName} ${lastName}`}
                <Icon className={styles.infoArrow} icon="external-link-alt" type="solid" />
              </a>
              <button onClick={props.handleGoToChat} className={styles.dataLink}>
                <Icon className={styles.infoArrow} icon="comment-alt" type="solid" />
              </button>
            </div>,
          )}

          {patient.cellPhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Contact Info</div>

              <div className={styles.data}>
                {patient.cellPhoneNumber && <Icon icon="phone" size={0.9} type="solid" />}
                <div className={styles.data_text}>
                  {patient.cellPhoneNumber && patient.cellPhoneNumber[0] === '+'
                    ? formatPhoneNumber(patient.cellPhoneNumber)
                    : patient.cellPhoneNumber}
                  {patient.cellPhoneNumber && (
                    <PointOfContactBadge patientId={patient.id} channel="phone" />
                  )}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email && <Icon icon="envelope" size={0.9} type="solid" />}
                <div className={styles.data_text}>{patient.email}</div>
                {patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />}
              </div>
            </div>
          ) : (
            popoverDataSections('Contact Info', 'n/a')
          )}

          {popoverDataSections(
            'Practitioner',
            `${practitioner.firstName} ${practitioner.lastName || null}`,
          )}

          {chair && popoverDataSections('Chair', chair.name)}

          {note &&
            popoverDataSections(
              'Note',
              <div className={styles.data_note}>
                <TextArea disabled="disabled" theme={textAreaTheme}>
                  {note}
                </TextArea>
              </div>,
            )}
        </SBody>
        <EnabledFeature
          predicate={({ flags }) => flags.get('show-edit-appointment')}
          render={() => (
            <SFooter className={styles.footer}>
              <Button
                color="blue"
                dense
                compact
                className={styles.editButton}
                onClick={() => props.editAppointment()}
              >
                Edit Appointment
              </Button>
            </SFooter>
          )}
        />
      </SContainer>
    </Card>
  );
}

AppointmentInfo.propTypes = {
  editAppointment: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
  age: PropTypes.number,
  chair: PropTypes.instanceOf(ChairModel).isRequired,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  patientUrl: PropTypes.string.isRequired,
  handleGoToChat: PropTypes.func.isRequired,
};

AppointmentInfo.defaultProps = { age: null };
