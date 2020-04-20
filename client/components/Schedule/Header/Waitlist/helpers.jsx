
import { setDateToTimezone, week, dateFormatter, capitalize } from '@carecru/isomorphic';
import moment from 'moment-timezone';
import PatientUserPopover from '../../../library/PatientUserPopover';
import PatientPopover from '../../../library/PatientPopover';

/**
 * Factory to format a date value.
 *
 * @param timezone
 * @return {function(*=): *}
 */
const dateFormatterFactory = timezone => time =>
  formatTimeToTz(new Date(time).toISOString(), timezone);

/**
 * Checks if the provided time is a full hour before formatting,
 * so that we can format 22:00 as 10p or 15:45 as 3:45p.
 *
 * @param value
 * @param timezone
 * @return string
 */
const formatTimeToTz = (value, timezone) => {
  const valueInstance = setDateToTimezone(value, timezone);
  const format = valueInstance.minutes() === 0 ? 'ha' : 'h:mma';
  return valueInstance.format(format);
};

/**
 * Checks if the provided input is present inside of the lookup table.
 *
 * @param criteria
 * @param input
 * @return boolean
 */
const checkIfHasEvery = (criteria, input) => week[criteria].every(d => input.includes(d));

/**
 * Checks if a day is a weekend day.
 *
 * @param day
 * @return boolean
 */
const isAWeekendDay = day => week.weekends.includes(day);

/**
 * Checks if a difference between 2 ISOStrings is equal to 1 hour
 *
 * @param time1
 * @param time2
 * @return {boolean}
 */
const isOneHourApart = (time1, time2) => (moment(time2).diff(moment(time1), 'hour') || 0) === 1;

/**
 * Formats a list of times in a more readable way.
 *
 * @param times
 * @param timezone
 * @return {*}
 */
export const waitlistTimesFormatter = (times, timezone) => {
  const formatTime = dateFormatterFactory(timezone);

  return times.reduce((acc, curr, i, arr) => {
    const time = formatTime(curr);

    if (i === 0) {
      return time;
    }

    const prevTime = isOneHourApart(arr[i - 1], curr);
    const nextTime = isOneHourApart(curr, arr[i + 1]);

    if (prevTime && nextTime) {
      return acc;
    }
    const connectionString = prevTime && !nextTime ? '-' : '; ';

    return acc.concat(connectionString, time);
  }, '');
};

/**
 * Should not include a day if the rest of the week
 * or the weekend is presented in the selectedDays list.
 *
 * @param value
 * @param selectedDays
 * @return {boolean}
 */
const shouldIncludeDay = (value, selectedDays) => {
  const hasEveryWeekDay = checkIfHasEvery('weekdays', selectedDays);
  const hasEveryWeekendDay = checkIfHasEvery('weekends', selectedDays);

  return !(isAWeekendDay(value) ? hasEveryWeekendDay : hasEveryWeekDay);
};

/**
 * Logic that generates the list of days as a string.
 *
 * @param days
 * @return {*}
 */
const generateReadableListOfDays = (days) => {
  const isAlreadyIn = {
    weekdays: false,
    weekends: false,
    get: key => isAlreadyIn[key],
    set: (key, value = true) => {
      isAlreadyIn[key] = value;
    },
  };

  return days
    .reduce((acc, curr) => {
      const groupKey = isAWeekendDay(curr) ? 'weekends' : 'weekdays';
      if (isAlreadyIn.get(groupKey)) {
        return acc;
      }

      if (!shouldIncludeDay(curr, days)) {
        isAlreadyIn.set(groupKey);
      }

      const value = shouldIncludeDay(curr, days) ? curr : groupKey;

      return acc.concat(capitalize(value), ', ');
    }, '')
    .slice(0, -2);
};

/**
 * Formats a list of days in a more readable way.
 *
 * @param days
 * @return {string|*}
 */
export const waitlistDatesFormatter = (days) => {
  const entries = Object.entries(days).filter(([, selected]) => selected);
  const selectedDays = entries.map(([day]) => day);

  if (selectedDays.length === 7) {
    return 'All';
  }

  return generateReadableListOfDays(selectedDays);
};

/**
 * Converts an array of waitlists into an key-value object,
 * by default the value is false.
 *
 * @return {object}
 * @param waitlist
 */
export const batchUpdateFactory = waitlist => (state = false) =>
  waitlist.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: state,
    }),
    {},
  );

export const mergeData = (data, dataset) =>
  data.map(v => ({
    ...v,
    patientData: dataset[v.waitSpotId][0].patientData,
  }));

/**
 * Standardize props regardless if the input is a PatientUser or a Patient.
 *
 * @param patient
 * @param id
 * @param createdAt
 * @param patientUser
 * @param endDate
 * @param availableTimes
 * @param daysOfTheWeek
 * @param props
 * @param timezone
 * @param removeWaitSpot
 * @param toggleSingleWaitlistSelection
 * @return {{
 * times: string,
 * addedDate: string,
 * nextApptDate: (string|null),
 * patient: (*),
 * PopOverComponent: (*),
 * dates: string,
 * key: string
 * }}
 */
export const propsGenerator = ({
  patient,
  ccId,
  createdAt,
  patientUser,
  endDate,
  availableTimes,
  daysOfTheWeek,
  timezone,
  selectedWaitlistMap,
  removeWaitSpot,
  toggleSingleWaitlistSelection,
  ...props
}) => {
  const hasTimes = availableTimes.length > 0;
  const isPatientUser = !!patientUser;
  const nextAppt = isPatientUser ? endDate : patient?.nextApptDate;
  return {
    ...props,
    key: ccId,
    checked: selectedWaitlistMap[ccId],
    onChange: () => toggleSingleWaitlistSelection(ccId),
    onRemove: () => removeWaitSpot({ id: ccId }),
    addedDate: dateFormatter(createdAt, '', 'YYYY/MM/DD'),
    dates: waitlistDatesFormatter(daysOfTheWeek),
    nextApptDate: nextAppt ? dateFormatter(nextAppt, '', 'YYYY/MM/DD') : null,
    patient: isPatientUser ? patientUser : patient,
    PopOverComponent: isPatientUser ? PatientUserPopover : PatientPopover,
    times: hasTimes ? waitlistTimesFormatter(availableTimes.sort(), timezone) : 'N/A',
  };
};