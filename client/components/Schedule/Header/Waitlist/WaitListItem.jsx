
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import { week, dateFormatter, formatPhoneNumber } from '@carecru/isomorphic';
import {
  Avatar,
  Icon,
  PatientPopover,
  IconButton,
  Checkbox,
  Collapsible,
  ListItem,
} from '../../../library';
import { isHub } from '../../../../util/hub';
import { waitSpotShape, patientShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';
import todoStyles from '../../../Dashboard/DonnaToDoListContainer/Tasks/styles.scss';

const WaitListItem = ({
  waitSpot,
  patient,
  removeWaitSpot,
  isPatientUser,
  removeBorder,
  selected,
  timezone,
  onSelect: onSelectCallback,
}) => {
  const renderPatientHeading = () =>
    (isHub() ? (
      <div className={styles.name}>
        {patient.firstName} {patient.lastName}
      </div>
    ) : (
      <PatientPopover
        patient={
          isPatientUser
            ? {
                ...patient,
                endDate: waitSpot.endDate,
              }
            : patient
        }
        isPatientUser={isPatientUser}
        placement="left"
      >
        <div className={styles.name}>
          {patient.firstName} {patient.lastName}
        </div>
      </PatientPopover>
    ));

  const renderPatientProfile = () => {
    const patientPhone = isPatientUser ? 'phoneNumber' : 'mobilePhoneNumber';

    return (
      <div className={styles.collapsiblePatientInfo}>
        <div className={styles.info}>
          <span className={styles.subHeader}>Gender: </span>
          <span className={styles.dataText}>{patient.gender}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Contact Info</span>
          {patient[patientPhone] && (
            <div className={styles.infoContainer}>
              <Icon icon="phone" className={styles.icon} />
              <span className={styles.infoData}>{formatPhoneNumber(patient[patientPhone])}</span>
            </div>
          )}
          {patient.email && (
            <div className={styles.infoContainer}>
              <Icon icon="envelope" className={styles.icon} />
              <span className={styles.infoData}>{patient.email}</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Next appointment: </span>
          <span className={styles.dataText}>
            {patient.nextApptDate
              ? dateFormatter(patient.nextApptDate, timezone, 'MMM Do, YYYY h:mm A')
              : 'n/a'}
            {isPatientUser &&
              patient.endDate &&
              dateFormatter(patient.endDate, timezone, 'MMM Do, YYYY h:mm A')}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Last appointment: </span>
          <span className={styles.dataText}>
            {patient.lastApptDate
              ? dateFormatter(patient.lastApptDate, timezone, 'MMM Do, YYYY h:mm A')
              : 'n/a'}
          </span>
        </div>
        <div className={styles.info}>
          <span className={styles.subHeader}>Address: </span>
          {patient.address && Object.keys(patient.address).length ? (
            <div>
              <div className={styles.dataText}>{patient.address.street}</div>
              <div className={styles.dataText}>{patient.address.city}</div>
              <div className={styles.dataText}>{patient.address.country}</div>
            </div>
          ) : (
            <span className={styles.dataText}>n/a</span>
          )}
        </div>
      </div>
    );
  };

  const renderContentHub = () => {
    if (!patient) return null;
    const { daysOfTheWeek, endDate, availableTimes } = waitSpot;
    const checkIfAnyTrue = Object.keys(daysOfTheWeek).every(k => !daysOfTheWeek[k]);
    const patientPhone = isPatientUser ? 'phoneNumber' : 'cellPhoneNumber';

    const nextAppt =
      (isPatientUser
        ? dateFormatter(endDate, timezone, 'MMM Do YYYY')
        : patient.nextApptDate && dateFormatter(patient.nextApptDate, timezone, 'MMM Do YYYY')) ||
      'n/a';
    const filteredPreferencesList =
      availableTimes &&
      availableTimes
        .map(time => dateFormatter(new Date(time).toISOString(), timezone, 'LT'))
        .join(', ');

    return (
      <div className={styles.waitListItem} data-test-id="list_waitListItem">
        <Checkbox
          customContainer={classNames(styles.checkBox, { [styles.checked]: selected })}
          onChange={(e) => {
            e.stopPropagation();
            onSelectCallback();
          }}
          checked={selected}
        />
        <div
          className={classNames({
            [styles.wrapper]: !isHub(),
            [styles.listItemWrapperHub]: isHub(),
            [styles.removeBorder]: removeBorder,
          })}
        >
          <div className={styles.heading}>
            <Avatar user={patient} size="xs" />
            {renderPatientHeading()}
          </div>
          <div className={styles.avatar}>
            <Avatar user={patient} size="sm" />
          </div>
          <div className={styles.patientPrefInfo}>
            {renderPatientHeading()}
            <div className={styles.info}>
              <span className={styles.subHeader}> Next Appt: </span>
              <span className={styles.dataText}>{nextAppt}</span>
            </div>
            <div className={styles.info}>
              <span className={styles.subHeader}>Preferences: </span>
              <span className={styles.dataText}>{filteredPreferencesList}</span>
            </div>
            {!checkIfAnyTrue && (
              <div className={styles.info}>
                <span className={styles.subHeader}>Preferred Days: </span>
                <span className={styles.dataText}>
                  {week.all.filter(day => daysOfTheWeek[day]).join(', ')}
                </span>
              </div>
            )}
            <div className={styles.info}>
              <span className={styles.subHeader}> Requested on: </span>
              <span className={classNames([styles.dataText, styles.createdAt])}>
                {dateFormatter(waitSpot.createdAt, timezone, 'MMM DD, YYYY h:mm A')}
              </span>
            </div>
          </div>
          <div className={styles.patientGeneralInfo}>
            {patient[patientPhone] && (
              <div className={styles.infoContainer}>
                <Icon icon="phone" className={styles.icon} />
                <span className={styles.infoData}>{formatPhoneNumber(patient[patientPhone])}</span>
              </div>
            )}
            {patient.email && (
              <div className={styles.infoContainer}>
                <Icon icon="envelope" className={styles.icon} />
                <span className={styles.infoData}>{patient.email}</span>
              </div>
            )}
          </div>
          <div className={styles.remove}>
            <IconButton icon="times" onClick={removeWaitSpot} />
          </div>
        </div>
      </div>
    );
  };

  const diffHour = (time1, time2) => {
    if (!time1 || !time2) {
      return 0;
    }
    return moment(time2).diff(moment(time1), 'hour');
  };

  const timeLT = time => (time ? dateFormatter(new Date(time).toISOString(), timezone, 'LT') : '');

  const handleWaitListTimes = (arrTimes) => {
    if (arrTimes.length === 1) {
      return timeLT(arrTimes[0]);
    }

    return arrTimes.reduce((acc, cur, idx, arr) => {
      // first element
      idx === 1 && (acc = timeLT(acc));

      // last element
      if (idx === arr.length - 1) {
        if (diffHour(arr[idx - 1], cur) === 1) {
          return `${acc} - ${timeLT(cur)}`;
        }
        return `${acc}, ${timeLT(cur)}`;
      }

      // middle elements
      if (diffHour(arr[idx - 1], cur) === 1) {
        if (diffHour(cur, arr[idx + 1]) === 1) {
          return acc; // continue
        }
        return `${acc} - ${timeLT(cur)}`; // range last
      }
      return `${acc}, ${timeLT(cur)}`; // range first
    });
  };

  const renderContentWeb = () => {
    if (!patient) return null;
    const { daysOfTheWeek, endDate, availableTimes } = waitSpot;
    const checkIfAnyTrue = Object.keys(daysOfTheWeek).every(k => !daysOfTheWeek[k]);

    const nextAppt =
      (isPatientUser
        ? dateFormatter(endDate, timezone, 'MMM Do YYYY')
        : patient.nextApptDate && dateFormatter(patient.nextApptDate, timezone, 'MMM Do YYYY')) ||
      'n/a';

    // preference days
    const weekDays = {
      sunday: 'Sun',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thur',
      friday: 'Fri',
      saturday: 'Sat',
    };
    const filteredDays = week.all.filter(day => daysOfTheWeek[day]);
    const preferenceDays = filteredDays.map(day => weekDays[day]).join(', ');

    // preference times
    const preferenceTimes =
      availableTimes.length > 0 ? handleWaitListTimes(availableTimes.sort()) : 'N/A';

    return (
      <ListItem className={styles.listItem}>
        <div className={todoStyles.avatar}>
          <Avatar size="sm" user={patient} />
        </div>
        <div className={todoStyles.col}>
          <span>
            <PatientPopover className={styles.patientPopover} patient={patient}>
              <div>{`${patient.firstName} ${patient.lastName}`}</div>
            </PatientPopover>
          </span>
        </div>
        {!checkIfAnyTrue && (
          <div className={todoStyles.waitlistCol}>
            <span className={styles.dataText}>{preferenceDays}</span>
          </div>
        )}
        <div className={todoStyles.waitlistCol}>
          <span className={styles.dataText}>{preferenceTimes}</span>
        </div>
        <div className={todoStyles.waitlistCol}>
          <span className={styles.dataText}>{nextAppt}</span>
        </div>
        <div className={styles.remove}>
          <IconButton icon="times" onClick={removeWaitSpot} />
        </div>
      </ListItem>
    );
  };

  return isHub() ? (
    <Collapsible hasIcon={false} title={renderContentHub()}>
      {renderPatientProfile()}
    </Collapsible>
  ) : (
    renderContentWeb()
  );
};

WaitListItem.defaultProps = {
  patient: null,
  isPatientUser: false,
  removeBorder: false,
  selected: false,
};

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  patient: PropTypes.shape(patientShape),
  waitSpot: PropTypes.shape(waitSpotShape).isRequired,
  isPatientUser: PropTypes.bool,
  removeBorder: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(WaitListItem);
