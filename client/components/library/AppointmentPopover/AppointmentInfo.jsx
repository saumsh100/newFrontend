import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';
import { formatPhoneNumber } from '../../../util/isomorphic';
import ActionsDropdown from '../../Patients/PatientInfo/ActionsDropdown';
import {
  Card,
  Icon,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  StandardButton as Button,
  PointOfContactBadge,
  nonApptWritePMS,
} from '..';
import { patientShape, appointmentShape, practitionerShape } from '../PropTypeShapes/index';
import Appointments from '../../../entities/models/Appointments';
import ChairModel from '../../../entities/models/Chair';
import EnabledFeature from '../EnabledFeature';
import styles from './reskin-styles.scss';
import { getFormattedDate, getTodaysDate } from '../util/datetime';
import { gqlQueryFetchIsPoc } from '../PatientQueryRenderer';

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

const AppointmentInfo = (props) => {
  const {
    patient,
    appointment,
    practitioner,
    chair,
    editPatient,
    title,
    timezone,
    errorTitle,
    errorMessage,
  } = props;
  const { data } = useQuery(gqlQueryFetchIsPoc, {
    variables: { patientId: patient?.id },
  });
  const { startDate, endDate, note, reason, description } = appointment;
  const age = patient?.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : null;
  const appointmentDate = getFormattedDate(startDate, 'dddd LL', timezone);
  const notes = description || note || '';
  const TitleComponent = errorTitle ? (
    <>
      <Icon icon="calendar-alt" className={styles.calendarIcon} />
      <span className={styles.header_text}>{errorTitle}</span>
    </>
  ) : (
    <span className={styles.header_text}>{title}</span>
  );

  return (
    <Card className={styles.card} noBorder>
      <SContainer>
        <SHeader className={styles.appointmentHeader} hey="header">
          <Icon icon="calendar-alt" className={styles.appointmentHeader_calendarIcon} />
          {patient ? (
            <>
              <div
                role="button"
                tabIndex={0}
                className={styles.appointmentPatientLink}
                onDoubleClick={() => {
                  if (data?.accountViewer?.patient) {
                    editPatient(patient.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && data?.accountViewer?.patient) {
                    editPatient(patient.id);
                  }
                }}
              >
                <ActionsDropdown
                  patient={patient}
                  render={({ onClick }) => (
                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                      onClick={() => {
                        if (data?.accountViewer?.patient) {
                          onClick();
                        }
                      }}
                      className={styles.appointmentPatientButton}
                    >
                      <span className={styles.appointmentHeader_text}>
                        {`${patient.firstName} ${patient.lastName}`}
                      </span>
                      {age !== null && (
                        <span className={styles.appointmentHeader_age}>{`, ${age}`}</span>
                      )}
                      {data?.accountViewer?.patient && (
                        <Icon
                          icon="caret-down"
                          type="solid"
                          className={styles.appointmentHeader_actionsButtonSmall}
                        />
                      )}
                    </div>
                  )}
                />
              </div>
            </>
          ) : (
            TitleComponent
          )}
          <button type="button" className={styles.closeIcon} onClick={() => props.closePopover()}>
            <Icon icon="times" size={1.2} />
          </button>
        </SHeader>
        <SBody className={styles.body} key="body">
          {errorMessage && (
            <div className={styles.popoverErrorMessage}>
              <Icon icon="exclamation-circle" className={styles.popoverErrorIcon} />
              {errorMessage}
            </div>
          )}
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
              `${practitioner.firstName} ${practitioner.lastName || ''}`,
            )}

          {chair && popoverDataSections('Chair', chair.name)}

          {(notes && popoverDataSections('Notes', notes)) ||
            (title && popoverDataSections('Notes', 'n/a'))}

          {patient?.cellPhoneNumber || patient?.email ? (
            <div className={styles.container} key="contact">
              <div className={styles.subHeader}>Patient Info</div>

              <div className={styles.data}>
                {patient.cellPhoneNumber && (
                  <Icon icon="phone" size={0.9} type="solid" className={styles.data_icon} />
                )}
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
                {patient.email && (
                  <Icon icon="envelope" size={0.9} type="solid" className={styles.data_icon} />
                )}
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
                  className={styles.editButton}
                  onClick={() => props.editAppointment()}
                  disabled={props.nonApptWritePMS}
                  variant="primary"
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
};

AppointmentInfo.defaultProps = {
  title: '',
  errorTitle: '',
  errorMessage: '',
  editAppointment: null,
  editPatient: null,
  chair: null,
  practitioner: null,
  patient: null,
};

AppointmentInfo.propTypes = {
  errorTitle: PropTypes.string,
  errorMessage: PropTypes.string,
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
  timezone: PropTypes.string.isRequired,
  nonApptWritePMS: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  nonApptWritePMS: nonApptWritePMS(auth.get('adapterType')),
  timezone: auth.get('timezone'),
});

export default connect(mapStateToProps, null)(AppointmentInfo);
