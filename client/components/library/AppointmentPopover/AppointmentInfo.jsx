
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { formatPhoneNumber, setDateToTimezone } from '@carecru/isomorphic';
import ActionsDropdown from '../../Patients/PatientInfo/ActionsDropdown';
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
import Appointments from '../../../entities/models/Appointments';
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
  const { patient, appointment, practitioner, chair, editPatient } = props;
  const { startDate, endDate, note, reason } = appointment;
  const age = patient.birthDate
    ? setDateToTimezone(Date.now(), null).diff(patient.birthDate, 'years')
    : null;
  const appointmentDate = moment(startDate).format('dddd LL');
  const textAreaTheme = { group: styles.textAreaGroup };

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Icon icon="calendar" size={1.5} />
          <div
            role="button"
            tabIndex={0}
            className={classNames(styles.patientLink, styles.textWhite)}
            onDoubleClick={() => editPatient(patient.id)}
            onKeyDown={e => e.keyCode === 13 && editPatient(patient.id)}
          >
            <ActionsDropdown
              patient={patient}
              render={({ onClick }) => (
                <div role="button" tabIndex={0} onKeyDown={this.handleKeyDown} onClick={onClick}>
                  <span className={styles.header_text}>
                    {`${patient.firstName} ${patient.lastName}`}
                  </span>
                  {age !== null && <span className={styles.header_age}>{`, ${age}`}</span>}
                  <span className={styles.actionsButtonSmall}>
                    <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
                  </span>
                </div>
              )}
            />
          </div>

          <div className={styles.closeIcon}>
            <IconButton icon="times" onClick={() => props.closePopover()} />
          </div>
        </SHeader>
        <SBody className={styles.body}>
          {popoverDataSections('Date', appointmentDate)}

          {popoverDataSections(
            'Time',
            <div className={styles.data}>
              {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
            </div>,
          )}

          {!!reason && popoverDataSections('Appointment Type', `${reason}`)}

          {popoverDataSections(
            'Practitioner',
            `${practitioner.firstName} ${practitioner.lastName || null}`,
          )}

          {chair && popoverDataSections('Chair', chair.name)}

          {note &&
            popoverDataSections(
              'Notes',
              <div className={styles.data_note}>
                <TextArea disabled="disabled" theme={textAreaTheme}>
                  {note}
                </TextArea>
              </div>,
            )}

          {patient.cellPhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>

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
  editPatient: PropTypes.func.isRequired,
  closePopover: PropTypes.func.isRequired,
  chair: PropTypes.instanceOf(ChairModel).isRequired,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  patient: PropTypes.shape(patientShape).isRequired,
  appointment: PropTypes.oneOfType([
    PropTypes.instanceOf(Appointments),
    PropTypes.shape(appointmentShape),
  ]).isRequired,
};
