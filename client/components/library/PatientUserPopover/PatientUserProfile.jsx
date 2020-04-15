
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter, formatPhoneNumber, setDateToTimezone } from '@carecru/isomorphic';
import { Card, SContainer, SHeader, SBody, Avatar, Icon, IconButton } from '../../library';
import { patientShape } from '../PropTypeShapes';
import styles from './styles.scss';

const PatientUserProfile = ({ patient, closePopover }) => {
  const age = patient.birthDate
    ? setDateToTimezone(Date.now(), null).diff(patient.birthDate, 'years')
    : null;

  return (
    <Card className={styles.card} noBorder id="appPopOver">
      <SContainer>
        <SHeader className={styles.header}>
          <Avatar user={patient} size="xs" />
          <div>
            <span className={styles.header_text}>{`${patient.firstName} ${patient.lastName}`}</span>
            {age !== null && <span className={styles.header_age}>{`, ${age}`}</span>}
          </div>
          <div className={styles.closeIcon}>
            <IconButton icon="times" onClick={closePopover} />
          </div>
        </SHeader>
        <SBody className={styles.body}>
          {patient.gender ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Birthday</div>
              <div className={styles.data}>
                <span className={styles.basicText}>
                  {dateFormatter(patient.birthDate, '', 'MM/DD/YYYY')}
                </span>
              </div>
            </div>
          ) : null}
          {patient.gender ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Gender</div>
              <div className={styles.data}>
                <span className={styles.basicText}>{patient.gender}</span>
              </div>
            </div>
          ) : null}

          {patient.phoneNumber || patient.email ? (
            <div className={styles.container}>
              <div className={styles.subHeader}>Contact Info</div>

              <div className={styles.data}>
                {patient.phoneNumber ? <Icon icon="phone" size={0.9} /> : null}
                <div className={styles.data_text}>
                  {patient.phoneNumber && patient.phoneNumber[0] === '+'
                    ? formatPhoneNumber(patient.phoneNumber)
                    : patient.phoneNumber}
                </div>
              </div>

              <div className={styles.data}>
                {patient.email ? <Icon icon="envelope" size={0.9} /> : null}
                <div className={styles.data_text}>{patient.email}</div>
              </div>
            </div>
          ) : (
            <div className={styles.container}>
              <div className={styles.subHeader}>Contact Info</div>
              <div className={styles.data}>n/a</div>
            </div>
          )}
        </SBody>
      </SContainer>
    </Card>
  );
};
export default PatientUserProfile;

PatientUserProfile.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  closePopover: PropTypes.func.isRequired,
};
