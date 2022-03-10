import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { week } from '../../../../util/isomorphic';
import {
  Avatar,
  PatientPopover,
  IconButton,
  ListItem,
  getFormattedDate,
  getUTCDate,
} from '../../../library';
import { waitSpotShape, patientShape } from '../../../library/PropTypeShapes';
import styles from './styles.scss';
import todoStyles from '../../../Dashboard/DonnaToDoListContainer/Tasks/styles.scss';

const WaitListItem = ({ waitSpot, patient, removeWaitSpot, isPatientUser, timezone }) => {
  const diffHour = (time1, time2) => {
    if (!time1 || !time2) {
      return 0;
    }
    return getUTCDate(time2).diff(getUTCDate(time1), 'hour');
  };

  const timeLT = (time) =>
    time ? getFormattedDate(new Date(time).toISOString(), 'LT', timezone) : '';

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
    const checkIfAnyTrue = Object.keys(daysOfTheWeek).every((k) => !daysOfTheWeek[k]);

    const nextAppt =
      (isPatientUser
        ? getFormattedDate(endDate, 'MMM Do YYYY', timezone)
        : patient.nextApptDate &&
          getFormattedDate(patient.nextApptDate, 'MMM Do YYYY', timezone)) || 'n/a';

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
    const filteredDays = week.all.filter((day) => daysOfTheWeek[day]);
    const preferenceDays = filteredDays.map((day) => weekDays[day]).join(', ');

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
  renderContentWeb();
};

WaitListItem.defaultProps = {
  patient: null,
  isPatientUser: false,
  selected: false,
};

WaitListItem.propTypes = {
  removeWaitSpot: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  patient: PropTypes.shape(patientShape),
  waitSpot: PropTypes.shape(waitSpotShape).isRequired,
  isPatientUser: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps)(WaitListItem);
