
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Card,
  Avatar,
  IconButton,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Button,
  TextArea,
  PointOfContactBadge,
} from '../../../../library';
import { FormatPhoneNumber } from '../../../../library/util/Formatters';
import { appointmentShape } from '../../../../library/PropTypeShapes';
import PatientModel from '../../../../../entities/models/Patient';
import styles from './styles.scss';

export default function AppointmentPopover({ patient, appointment, scheduleView, ...props }) {
  const { startDate, endDate, practitionerData, chairData, note } = appointment;
  const age = moment().diff(patient.get('birthDate'), 'years') || '';
  const appointmentDate = moment(startDate).format('dddd LL');
  const lastName = age ? `${patient.lastName},` : patient.lastName;
  const textAreaTheme = { group: styles.textAreaGroup };
  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div className={styles.header_text}>
            {patient.firstName} {lastName} {age}
          </div>
          <IconButton className={styles.closeIcon} icon="times" onClick={props.closePopover} />
        </SHeader>
        <SBody className={styles.body}>
          <div className={styles.container}>
            <div className={styles.subHeader}>Date</div>
            <div className={styles.data}>{appointmentDate}</div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>Time</div>
            <div className={styles.data}>
              {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.subHeader}>
              {scheduleView === 'chair' ? 'Practitioner' : 'Chair'}
            </div>
            <div className={styles.data}>
              {scheduleView === 'chair' ? practitionerData.prettyName : chairData}
            </div>
          </div>

          {patient.mobilePhoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>

              <div className={styles.data}>
                {patient.mobilePhoneNumber && <Icon icon="phone" size={0.9} />}
                <div className={styles.data_text}>
                  {patient.mobilePhoneNumber && patient.mobilePhoneNumber[0] === '+'
                    ? FormatPhoneNumber(patient.mobilePhoneNumber)
                    : patient.mobilePhoneNumber}
                  {patient.mobilePhoneNumber && (
                    <PointOfContactBadge patientId={patient.id} channel="phone" />
                  )}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient.email}
                  {patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>Patient Info</div>
              <div className={styles.data}>n/a</div>
            </div>
          )}

          {note ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Note</div>
              <div className={styles.data}>
                <div className={styles.data_note}>
                  <TextArea disabled="disabled" theme={textAreaTheme}>
                    {note}
                  </TextArea>
                </div>
              </div>
            </div>
          ) : null}
        </SBody>

        <SFooter className={styles.footer}>
          <Button border="blue" onClick={props.closePopover} dense compact>
            Close
          </Button>
          <Button
            color="blue"
            onClick={props.editAppointment}
            dense
            compact
            className={styles.editButton}
            data-test-id="button_editAppointment"
          >
            Edit
          </Button>
        </SFooter>
      </SContainer>
    </Card>
  );
}

AppointmentPopover.propTypes = {
  patient: PropTypes.instanceOf(PatientModel).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  closePopover: PropTypes.func.isRequired,
  editAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string,
};

AppointmentPopover.defaultProps = { scheduleView: 'chair' };
