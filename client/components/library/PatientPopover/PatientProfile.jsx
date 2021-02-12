
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { formatPhoneNumber } from '@carecru/isomorphic';
import ActionsDropdown from '../../Patients/PatientInfo/ActionsDropdown';
import {
  Card,
  SContainer,
  SHeader,
  SBody,
  SFooter,
  Avatar,
  Icon,
  IconButton,
  Button,
  PointOfContactBadge,
  getUTCDate,
  getTodaysDate,
} from '..';
import { patientShape } from '../PropTypeShapes';
import styles from './styles.scss';

const PatientProfile = ({ patient, closePopover, isPatientUser, editPatient, timezone }) => {
  const age = patient.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : null;

  const patientPhone = isPatientUser ? 'phoneNumber' : 'cellPhoneNumber';

  const emptyData = subHeader => (
    <div className={styles.container}>
      <div className={styles.subHeader}>{subHeader}</div>
      <div className={styles.data}>n/a</div>
    </div>
  );

  const showNextAppt = !isPatientUser ? emptyData('Next Appointment') : null;
  return (
    <Card className={styles.card} noBorder id="appPopOver">
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <ActionsDropdown
            patient={patient}
            render={({ onClick }) => (
              <div
                role="button"
                tabIndex={0}
                onClick={onClick}
                className={classNames(styles.patientLink, styles.textWhite)}
                onDoubleClick={() => editPatient(patient.id)}
                onKeyDown={e => e.keyCode === 13 && onClick()}
              >
                <span className={styles.header_text}>
                  {`${patient.firstName} ${patient.lastName}`}
                </span>
                {age !== null && <span className={styles.header_age}>{`, ${age}`}</span>}
                <Icon icon="caret-down" type="solid" className={styles.actionIcon} />
              </div>
            )}
          />
          <div className={styles.closeIcon}>
            <IconButton icon="times" onClick={closePopover} />
          </div>
        </SHeader>
        <SBody className={styles.body}>
          {patient.gender ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Gender</div>
              <div className={styles.data}>
                <span className={styles.basicText}>{patient.gender}</span>
              </div>
            </div>
          ) : null}

          {patient[patientPhone] || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Contact Info</div>

              <div className={styles.data}>
                {patient[patientPhone] ? <Icon icon="phone" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient[patientPhone] && patient[patientPhone][0] === '+'
                    ? formatPhoneNumber(patient[patientPhone])
                    : patient[patientPhone]}

                  {patient[patientPhone] && (
                    <PointOfContactBadge patientId={patient.id} channel="phone" />
                  )}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>{patient.email}</div>
                {patient.email && <PointOfContactBadge patientId={patient.id} channel="email" />}
              </div>
            </div>
          ) : (
            emptyData('Contact Info')
          )}

          {patient.nextApptDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Next Appointment</div>
              <div className={styles.data}>
                {getUTCDate(patient.nextApptDate, timezone).format('MMM Do, YYYY h:mm A')}
              </div>
            </div>
          ) : (
            showNextAppt
          )}

          {isPatientUser && patient.endDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Next Appointment</div>
              <div className={styles.data}>
                {getUTCDate(patient.endDate, timezone).format('MMM Do, YYYY h:mm A')}
              </div>
            </div>
          ) : null}

          {patient.lastApptDate ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Last Appointment</div>
              <div className={styles.data}>
                {getUTCDate(patient.lastApptDate, timezone).format('MMM Do, YYYY h:mm A')}
              </div>
            </div>
          ) : (
            emptyData('Last Appointment')
          )}

          {patient.address && Object.keys(patient.address).length ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Address</div>
              <div className={styles.data}>{patient.address.street}</div>
              <div className={styles.data}>{patient.address.city}</div>
              <div className={styles.data}>{patient.address.country}</div>
            </div>
          ) : (
            emptyData('Address')
          )}
        </SBody>

        <SFooter className={styles.footer}>
          {!isPatientUser && (
            <Button
              color="blue"
              onClick={() => editPatient(patient.id)}
              dense
              compact
              className={styles.editButton}
            >
              Edit Patient
            </Button>
          )}
        </SFooter>
      </SContainer>
    </Card>
  );
};

PatientProfile.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  closePopover: PropTypes.func.isRequired,
  editPatient: PropTypes.func.isRequired,
  isPatientUser: PropTypes.bool,
  timezone: PropTypes.string.isRequired,
};

PatientProfile.defaultProps = {
  isPatientUser: false,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(PatientProfile);
