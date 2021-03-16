
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatPhoneNumber } from '../../../util/isomorphic';
import { Card, SContainer, SHeader, SBody, Avatar, Icon, IconButton } from '..';
import { patientShape } from '../PropTypeShapes';
import styles from './styles.scss';
import { getFormattedDate, getTodaysDate } from '../util/datetime';

const PatientUserProfile = ({ patient, closePopover, timezone }) => {
  const age = patient.birthDate ? getTodaysDate(timezone).diff(patient.birthDate, 'years') : null;

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
                  {getFormattedDate(patient.birthDate, 'MM/DD/YYYY', timezone)}
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

PatientUserProfile.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  closePopover: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });
export default connect(mapStateToProps, null)(PatientUserProfile);
