
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

  const isOnHub = isHub();

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
    [styles.wrapper]: !isOnHub,
    [styles.listItemWrapperHub]: isOnHub,
    [styles.removeBorder]: removeBorder,
  });

  const checkboxStyle = classNames(styles.checkBox, {
    [styles.checked]: selected,
  });

  const patientInfoSectionHub = isOnHub ? (
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
  ) : null;

  return (
    <div className={styles.waitListItem} data-test-id="list_waitListItem">
      {isOnHub && (
        <Checkbox customContainer={checkboxStyle} onChange={onSelect} checked={selected} />
      )}

      <div className={wrapperStyle}>
        {patientInfoSectionHub}

        {!isOnHub && (
          <div className={styles.avatar}>
            <Avatar user={patient} size="sm" />
          </div>
        )}

        <div className={styles.patientPrefInfo}>
          {!isOnHub && (
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
            {prefKeys.map((pref, index, arry) =>
                preferences[pref] && (
                  <span className={styles.dataText} key={`preferences_${pref}`}>
                    {pref}
                    {index === arry.length - 1 ? '' : ','}
                  </span>
                ))}
          </div>

          {!checkIfAnyTrue && (
            <div className={styles.info}>
              <span className={styles.subHeader}>Preferred Days: </span>
              {dayWeekKeys.map((day, index, arry) =>
                  daysOfTheWeek[day] && (
                    <span className={styles.dataText} key={`dayOfWeek_${day}`}>
                      {day}
                      {index === arry.length - 1 ? '' : ','}
                    </span>
                  ))}
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

        {!isOnHub && (
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

        {!isOnHub && (
          <div className={styles.remove}>
            <IconButton icon="times" onClick={removeWaitSpot} />
          </div>
        )}
      </div>
    </div>
  );
}

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  patient: PropTypes.shape(patientShape),
  waitSpot: PropTypes.instanceOf(WaitSpotModel),
  isPatientUser: PropTypes.bool,
  removeBorder: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

WaitListItem.defaultProps = {
  isPatientUser: false,
  removeBorder: false,
  patient: null,
  waitSpot: null,
};
