
import React from 'react';
import PropTypes from 'prop-types';
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
import { getFormattedDate } from '../util/datetime';

const popoverDataSections = (subHeaderText, data) => (
  <div className={styles.container} key={subHeaderText}>
    <div className={styles.subHeader} key="header">
      {subHeaderText}
    </div>
    {typeof data === 'string' ? (
      <div className={styles.data} key="data">
        {data}
      </div>
    ) : (
      data
    )}
  </div>
);

export default function AppointmentInfo(props) {
  const {
    patient,
    appointment,
    practitioner,
    chair,
    editPatient,
    title,
    extraStyles,
    timezone,
  } = props;
  const { startDate, endDate, note, reason, description } = appointment;
  const age = patient?.birthDate
    ? setDateToTimezone(Date.now(), null).diff(patient.birthDate, 'years')
    : null;
  const appointmentDate = getFormattedDate(startDate, 'dddd LL', timezone);
  const textAreaTheme = { group: styles.textAreaGroup };
  const notes = description || note || '';

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.header} hey="header">
          {patient ? (
            <React.Fragment>
              <Icon icon="calendar" size={1.25} />
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
                    <div
                      role="button"
                      className={styles.appointmentPopover}
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={onClick}
                    >
                      <span className={styles.header_text}>
                        {`${patient.firstName} ${patient.lastName}`}
                      </span>
                      {age !== null && <span>{`, ${age}`}</span>}
                      <span className={styles.actionsButtonSmall}>
                        <Icon icon="caret-down" type="solid" />
                      </span>
                    </div>
                  )}
                />
              </div>
            </React.Fragment>
          ) : (
            <span className={styles.header_text}>{title}</span>
          )}
          <div className={styles.closeIcon}>
            <IconButton icon="times" onClick={() => props.closePopover()} />
          </div>
        </SHeader>
        <SBody className={styles.body} key="body">
          {popoverDataSections('Date', appointmentDate)}

          {popoverDataSections(
            'Time',
            <div className={styles.data} key="time">
              {`${getFormattedDate(startDate, 'h:mm a', timezone)} - ${getFormattedDate(
                endDate,
                'h:mm a',
                timezone,
              )}`}
            </div>,
          )}

          {!!reason && popoverDataSections('Appointment Type', `${reason}`)}

          {practitioner &&
            popoverDataSections(
              'Practitioner',
              `${practitioner.firstName} ${practitioner.lastName || null}`,
            )}

          {chair && popoverDataSections('Chair', chair.name)}

          {(notes &&
            popoverDataSections(
              'Notes',
              <div className={styles.data_note} style={{ ...extraStyles?.note }} key="notes">
                <TextArea
                  disabled="disabled"
                  theme={textAreaTheme}
                  value={notes}
                  style={{ ...extraStyles?.note }}
                />
              </div>,
            )) ||
            (title && popoverDataSections('Notes', 'n/a'))}

          {patient?.cellPhoneNumber || patient?.email ? (
            <div className={styles.container} key="contact">
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
            !title && popoverDataSections('Contact Info', 'n/a')
          )}
        </SBody>
        {props.editAppointment && (
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
        )}
      </SContainer>
    </Card>
  );
}

AppointmentInfo.defaultProps = {
  title: '',
  editAppointment: null,
  editPatient: null,
  chair: null,
  practitioner: null,
  patient: null,
  extraStyles: {},
};

AppointmentInfo.propTypes = {
  editAppointment: PropTypes.func,
  editPatient: PropTypes.func,
  closePopover: PropTypes.func.isRequired,
  chair: PropTypes.instanceOf(ChairModel),
  practitioner: PropTypes.shape(practitionerShape),
  patient: PropTypes.shape(patientShape),
  appointment: PropTypes.oneOfType([
    PropTypes.instanceOf(Appointments),
    PropTypes.shape(appointmentShape),
  ]).isRequired,
  title: PropTypes.string,
  extraStyles: PropTypes.objectOf(PropTypes.string),
  timezone: PropTypes.string.isRequired,
};
