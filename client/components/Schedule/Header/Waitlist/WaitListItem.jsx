
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import moment from 'moment';
import { Avatar, Icon, PatientPopover, IconButton, Checkbox } from '../../../library';
import { patientShape } from '../../../library/PropTypeShapes';
import WaitSpotModel from '../../../../entities/models/WaitSpot';
import { FormatPhoneNumber } from '../../../library/util/Formatters';
import { isHub } from '../../../../util/hub';
import PatientModel from '../../../../entities/models/Patient';
import styles from './styles.scss';

export default function WaitListItem(props) {
  const {
    waitSpot,
    patient,
    removeWaitSpot,
    isPatientUser,
    removeBorder,
    onSelect,
    selected,
  } = props;

  if (!patient) {
    return null;
  }

  const { preferences, daysOfTheWeek } = waitSpot;

  const prefKeys = Object.keys(omit(preferences, ['weekdays', 'weekends']));

  const dayWeekKeys = Object.keys(daysOfTheWeek);
  const checkIfAnyTrue = dayWeekKeys.every(k => !daysOfTheWeek[k]);

  const patientPhone = isPatientUser ? 'phoneNumber' : 'mobilePhoneNumber';

  let nextAppt = null;

  if (isPatientUser) {
    nextAppt = moment(waitSpot.endDate).format('MMM Do YYYY');
  } else if (!isPatientUser && moment(patient.nextApptDate).isValid()) {
    nextAppt = moment(patient.nextApptDate).format('MMM Do YYYY');
  }

  const wrapperStyle = classNames({
    [styles.wrapper]: !isHub(),
    [styles.listItemWrapperHub]: isHub(),
    [styles.removeBorder]: removeBorder,
  });

  const checkboxStyle = classNames(styles.checkBox, {
    [styles.checked]: selected,
  });

  const patientInfoSectionHub = isHub() && (
    <div className={styles.heading}>
      <Avatar user={patient} size="xs" />
      <PatientPopover
        patient={isPatientUser ? Object.assign(patient, { endDate: waitSpot.endDate }) : patient}
        isPatientUser={isPatientUser}
        placement="below"
      >
        <div className={styles.name}>
          {patient.firstName} {patient.lastName}
        </div>
      </PatientPopover>
    </div>
  );

  const filteredPreferencesList = prefKeys.filter(pref => preferences[pref]).join(', ');
  const filteredDaysList = dayWeekKeys.filter(day => daysOfTheWeek[day]).join(', ');

  return (
    <div className={styles.waitListItem} data-test-id="list_waitListItem">
      {isHub() && (
        <Checkbox customContainer={checkboxStyle} onChange={onSelect} checked={selected} />
      )}

      <div className={wrapperStyle}>
        {patientInfoSectionHub}

        {!isHub() && (
          <div className={styles.avatar}>
            <Avatar user={patient} size="sm" />
          </div>
        )}

        <div className={styles.patientPrefInfo}>
          {!isHub() && (
            <PatientPopover
              patient={
                isPatientUser ? Object.assign(patient, { endDate: waitSpot.endDate }) : patient
              }
              isPatientUser={isPatientUser}
              placement="left"
            >
              <div className={styles.name}>
                {patient.firstName} {patient.lastName}
              </div>
            </PatientPopover>
          )}

          <div className={styles.info}>
            <span className={styles.subHeader}> Next Appt: </span>
            <span className={styles.dataText}>{nextAppt || 'n/a'}</span>
          </div>

          <div className={styles.info}>
            <span className={styles.subHeader}>Preferences: </span>
            <span className={styles.dataText}>{filteredPreferencesList}</span>
          </div>

          {!checkIfAnyTrue && (
            <div className={styles.info}>
              <span className={styles.subHeader}>Preferred Days: </span>
              <span className={styles.dataText}>{filteredDaysList}</span>
            </div>
          )}

          <div className={styles.info}>
            <span className={styles.subHeader}> Requested on: </span>
            <span className={styles.dataText}>
              <br />
              {moment(waitSpot.createdAt).format('MMM DD, YYYY h:mm A')}
            </span>
          </div>
        </div>

        {!isHub() && (
          <div className={styles.patientGeneralInfo}>
            {patient[patientPhone] ? (
              <div className={styles.infoContainer}>
                <Icon icon="phone" className={styles.icon} />
                <span className={styles.infoData}>{FormatPhoneNumber(patient[patientPhone])}</span>
              </div>
            ) : null}
            {patient.email ? (
              <div className={styles.infoContainer}>
                <Icon icon="envelope" className={styles.icon} />
                <span className={styles.infoData}>{patient.email}</span>
              </div>
            ) : null}
          </div>
        )}

        {!isHub() && (
          <div className={styles.remove} onClick={removeWaitSpot}>
            <Icon icon="times" />
          </div>
        )}
      </div>
    </div>
  );
}

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  patient: PropTypes.instanceOf(PatientModel),
  waitSpot: PropTypes.shape({
    endDate: PropTypes.string,
    createdAt: PropTypes.string,
    preferences: PropTypes.shape({
      evenings: PropTypes.bool,
      mornings: PropTypes.bool,
      afternoons: PropTypes.bool,
    }),
    daysOfTheWeek: PropTypes.shape({
      friday: PropTypes.bool,
      monday: PropTypes.bool,
      sunday: PropTypes.bool,
      tuesday: PropTypes.bool,
      saturday: PropTypes.bool,
      thursday: PropTypes.bool,
      wednesday: PropTypes.bool,
    }),
  }).isRequired,
  isPatientUser: PropTypes.bool,
  removeBorder: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

WaitListItem.defaultProps = {
  isPatientUser: false,
  removeBorder: false,
  patient: null,
  selected: false,
};
