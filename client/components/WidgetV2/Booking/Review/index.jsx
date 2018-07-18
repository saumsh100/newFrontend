
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createAvailabilitiesFromOpening from '../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import { Button } from '../../../library';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { setIsBooking } from '../../../../actions/availabilities';
import { createRequest, createWaitSpot } from '../../../../thunks/availabilities';
import { officeHoursShape } from '../../../library/PropTypeShapes/officeHoursShape';
import { capitalizeFirstLetter } from '../../../Utils';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import dateFormatter from '../../../../../iso/helpers/dateTimezone/dateFormatter';
import dateFormatterFactory from '../../../../../iso/helpers/dateTimezone/dateFormatterFactory';
import toHumanCommaSeparated from '../../../../../iso/helpers/string/toHumanCommaSeparated';
import sortAsc from '../../../../../iso/helpers/sort/sortAsc';
import { bookingReviewSVG } from '../../SVGs';
import styles from './styles.scss';

const NOT_PROVIDED_TEXT = 'Not Provided';

/**
 * Check if the user is on the Review's route
 * or just on the summary tab.
 * If it's on the Review's page set the return the path passed,
 * otherwise just return false.
 *
 * @param {string} path
 */
const contextualUrl = (actualPathname, nextRoute) => {
  const match = matchPath(actualPathname, {
    path: '/widgets/:accountId/app/book/review',
    exact: true,
  });

  if (!match) {
    return false;
  }
  return nextRoute;
};

/**
 * With the provided unavailableDates array,
 * return not provided if the array is empty,
 * otherwhise sort it, format it and add a comma after each values.
 *
 * @param {array} unavailableDates
 */
const waitlistUnavailableDates = (unavailableDates, timezone) => {
  if (!unavailableDates.length) return NOT_PROVIDED_TEXT;

  // It shows the days that are on the unavailableDates list.
  return unavailableDates
    .sort(sortAsc)
    .map(value => dateFormatter(value, timezone, 'MMM Do'))
    .reduce(toHumanCommaSeparated);
};

/**
 * Display the dates selected on the waitlist's steps.
 * If is a regular range display the first and the last day,
 * otherwise display a list of dates.
 */
const waitlistDates = (dates, timezone) => {
  if (dates.length === 0) {
    return null;
  }
  const firstDate = dateFormatter(dates[0], timezone, 'MMM Do');
  const lastDate = dateFormatter(dates[dates.length - 1], timezone, 'MMM Do');
  /**
   * It shows the days that are on the waitlist.
   */
  return `From: ${firstDate} - To: ${lastDate}`;
};

const compareTimes = earlier => (value, ref) => (value && earlier ? value < ref : value > ref);
const isValueEarlier = compareTimes(true);
const isValueLater = compareTimes(false);

const getOfficeHours = (key, comparison) => (acc, curr) => {
  if (!acc || (acc && curr && comparison(curr[key], acc))) {
    acc = curr[key];
  }
  return acc;
};

function Review({
  confirmedAvailability,
  dateAndTime,
  hasWaitList,
  history,
  isBooking,
  location: { pathname },
  notes,
  officeHours,
  patientUser,
  selectedPractitioner,
  selectedService,
  timezone,
  waitlist,
  ...props
}) {
  const officeHoursValues = Object.values(officeHours);
  /**
   * Look over the officeHours object and find the earliest startTime of the clinic.
   */
  const earliestStartTime = officeHoursValues.reduce(getOfficeHours('startTime', isValueEarlier));

  /**
   * Look over the officeHours object and find the latest endTime of the clinic.
   */
  const latestEndTime = officeHoursValues.reduce(getOfficeHours('endTime', isValueLater));

  /**
   * Generates the availabilities using the office openings,
   * also group them inside the specific time-frame.
   */
  const availabilities = createAvailabilitiesFromOpening({
    startDate: earliestStartTime,
    endDate: moment.tz(latestEndTime, timezone),
    duration: selectedService.get('duration'),
    interval: 60,
  }).reduce(groupTimesPerPeriod, {
    morning: [],
    afternoon: [],
    evening: [],
    total: 0,
  });

  /**
   * Manages if we should create a waitlist and an availability or both
   */
  const submitRequest = () => {
    const creationPromises = [
      ...(dateAndTime ? [props.createRequest()] : []),
      ...(hasWaitList ? [props.createWaitSpot()] : []),
    ];
    return Promise.all(creationPromises)
      .then(() => history.push('./complete'))
      .catch(err => console.error('Creating request failed', err));
  };

  /**
   * If the text is longer than 200 characters,
   * slice the text and add an ellipsis.
   *
   * @param {string} value
   */
  const ellipsisText = (value, delimiter) =>
    (value.length > delimiter ? `${value.slice(0, delimiter)}...` : value);

  /**
   * Renders the title, value and edit button for the provided data.
   *
   * @param {string} key
   * @param {string} value
   * @param {string} link
   */
  const renderSummaryItem = (key, value, link, goBack) => (
    <div className={styles.waitlistIndex}>
      <span className={styles.waitlistKey}>{key}</span>
      <span className={styles.waitlistValue}>
        {typeof value === 'string' ? <p>{ellipsisText(value, 200)}</p> : value}
        <Button
          className={styles.editLink}
          onClick={() => {
            if (!isBooking) {
              props.setIsBooking(true);
            }
            return history.push({ pathname: link, state: { nextRoute: goBack } });
          }}
        >
          {bookingReviewSVG}
        </Button>
      </span>
    </div>
  );

  /**
   * Configured formatter for the current account timezone and ha format.
   */
  const formatReviewDates = dateFormatterFactory('ha')(timezone);

  /**
   * With the provided array of strings,
   * build the text tha will be displayed on the Review's page.
   *
   * @param {array} selected
   */
  const handleAvailabilitiesTimes = selected => (acc, value) => {
    if (value === 'total') {
      return acc;
    }
    // Displays 'All day (starTime - endTime)'
    if (availabilities.total === selected.length) {
      return [
        <div>
          <strong>
            {`All day (${formatReviewDates(selected[0])} - ${formatReviewDates(selected[selected.length - 1])})`}
          </strong>
        </div>,
      ];
    }

    const timeframe = availabilities[value];

    // early return if theres no availabilitis on this time frame
    if (!availabilities[value].length) {
      return acc;
    }

    const timeFrame = capitalizeFirstLetter(value);
    // all positive messages are displayed in bold.
    let boldedText = '';
    // normal text
    let text = '';

    if (timeframe.length > 0 && timeframe.every(({ startDate }) => selected.includes(startDate))) {
      // Displays 'Timeframe starTime to endTime'
      const startTimeOnTimeFrame = formatReviewDates(timeframe[0].startDate);
      const endTimeOnTimeFrame = formatReviewDates(timeframe[timeframe.length - 1].startDate);
      boldedText += ` All (${startTimeOnTimeFrame} to ${endTimeOnTimeFrame})`;
    } else {
      // Displays an inline list of dates
      const timesReduced = timeframe.reduce(
        (dates, { startDate }) => {
          if (selected.includes(startDate)) {
            dates.in.push(startDate);
          } else {
            dates.out.push(startDate);
          }
          dates.total += 1;
          return dates;
        },
        { in: [], out: [], total: 0 },
      );

      if (timesReduced.in.length > 0) {
        if (timesReduced.in.length > timesReduced.total / 2) {
          const startTimeOnTimeFrame = timesReduced.in[0];
          const endTimeOnTimeFrame = timesReduced.in[timesReduced.in.length - 1];
          /**
           * add this to string
           */
          boldedText = ` ${formatReviewDates(startTimeOnTimeFrame)} to ${formatReviewDates(endTimeOnTimeFrame)}`;

          if (timesReduced.out.length > 0) {
            const excludedTimes = timesReduced.out.reduce(
              (but, time) =>
                (time < endTimeOnTimeFrame && time > startTimeOnTimeFrame
                  ? [...but, ...[time]]
                  : but),
              [],
            );

            const excludedText =
              excludedTimes.length > 0
                ? `but ${excludedTimes
                  .map(el => formatReviewDates(el))
                  .reduce(toHumanCommaSeparated)}`
                : '';
            text += ` ${excludedText}`;
          }
        } else {
          boldedText = ` ${timesReduced.in
            .map(el => formatReviewDates(el))
            .reduce(toHumanCommaSeparated)}`;
        }
      } else {
        text += ' None';
      }
    }

    // adding the new text line to the previous ones.
    return [
      ...acc,
      ...[
        <div>
          {`${timeFrame}: `}
          {boldedText.length > 0 && <strong>{boldedText}</strong>}
          {` ${text}`}
        </div>,
      ],
    ];
  };

  /**
   * Display a linear list of times that were selected from the user on the waitlist's steps.
   */
  const waitlistTimes = () =>
    waitlist.times.length > 0 && (
      <span>
        {Object.keys(availabilities)
          .reduce(handleAvailabilitiesTimes(waitlist.times), [])
          .map(text => text)}
      </span>
    );

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>Waitlist Information</h3>
          {waitlist.dates.length > 0 ? (
            <div>
              <p className={styles.subtitle}>
                Here are the informations that you already defined to your appointment.
              </p>
              {renderSummaryItem(
                'Reason',
                selectedService.get('name'),
                './reason',
                contextualUrl(pathname, './review'),
              )}
              {renderSummaryItem(
                'Available Dates',
                waitlistDates(waitlist.dates, timezone),
                './waitlist/select-dates',
                contextualUrl(pathname, '../review'),
              )}
              {renderSummaryItem(
                'Unavailable Dates',
                waitlistUnavailableDates(waitlist.unavailableDates, timezone),
                './waitlist/days-unavailable',
                contextualUrl(pathname, '../review'),
              )}
              {renderSummaryItem(
                'Times',
                waitlistTimes(),
                './waitlist/select-times',
                contextualUrl(pathname, '../review'),
              )}
            </div>
          ) : (
            <div className={styles.joinWaitlist}>
              <div className={styles.subCardWrapper}>
                <p className={styles.subCardSubtitle}>Looks like you did not set any waitlist</p>
              </div>
              <Button
                className={styles.subCardLink}
                onClick={() => {
                  if (!isBooking) {
                    props.setIsBooking(true);
                  }
                  history.push('./waitlist/select-dates');
                }}
              >
                Join Waitlist
              </Button>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>Appointment Information</h3>
          <p className={styles.subtitle}>
            Here are the informations that you already defined to your appointment.
          </p>
          {selectedService.get('name') &&
            renderSummaryItem(
              'Reason',
              selectedService.get('name'),
              './reason',
              contextualUrl(pathname, './review'),
            )}
          {renderSummaryItem(
            'Practitioner',
            (selectedPractitioner && selectedPractitioner.getPrettyName()) || 'No Preference',
            './practitioner',
            contextualUrl(pathname, './review'),
          )}
          {dateAndTime &&
            renderSummaryItem(
              'Date and Time',
              `${dateFormatter(dateAndTime.startDate, timezone, 'ddd, MMM Do')} at ${dateFormatter(
                dateAndTime.startDate,
                timezone,
                'h:mm a',
              )}`,
              './date-and-time',
              contextualUrl(pathname, './review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Patient',
              `${patientUser.firstName} ${patientUser.lastName}`,
              './patient-information',
              contextualUrl(pathname, './review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Insurance Carrier',
              `${patientUser.insuranceCarrier || NOT_PROVIDED_TEXT}`,
              './patient-information',
              contextualUrl(pathname, './review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Insurance Member ID & Group ID',
              `${patientUser.insuranceMemberId ||
                NOT_PROVIDED_TEXT} - ${patientUser.insuranceGroupId || NOT_PROVIDED_TEXT}`,
              './patient-information',
              contextualUrl(pathname, './review'),
            )}

          {patientUser &&
            renderSummaryItem(
              'Notes',
              `${notes || NOT_PROVIDED_TEXT}`,
              './additional-information',
              contextualUrl(pathname, './review'),
            )}
        </div>
        {((dateAndTime && confirmedAvailability) || hasWaitList) && (
          <Button className={styles.fullWidthButton} onClick={submitRequest}>
            Confirm Booking
          </Button>
        )}
      </div>
    </div>
  );
}

function mapStateToProps({ availabilities, entities, auth }) {
  const getPatientUser =
    availabilities.get('familyPatientUser') && auth.get('familyPatients').length > 0
      ? auth
        .get('familyPatients')
        .find(patient => patient.id === availabilities.get('familyPatientUser'))
      : false;
  return {
    dateAndTime: availabilities.get('selectedAvailability'),
    hasWaitList: availabilities.get('waitlist').get('dates').length > 0,
    isAuth: auth.get('isAuthenticated'),
    isBooking: availabilities.get('isBooking'),
    notes: availabilities.get('notes'),
    officeHours: availabilities.get('officeHours').toJS(),
    confirmedAvailability: availabilities.get('confirmedAvailability'),
    patientUser: getPatientUser,
    selectedPractitioner: entities.getIn([
      'practitioners',
      'models',
      availabilities.get('selectedPractitionerId'),
    ]),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    timezone: availabilities.get('account').get('timezone'),
    user: auth.get('patientUser'),
    waitlist: availabilities.get('waitlist').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createRequest,
      createWaitSpot,
      setIsBooking,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));

Review.propTypes = {
  confirmedAvailability: PropTypes.bool.isRequired,
  createRequest: PropTypes.func.isRequired,
  createWaitSpot: PropTypes.func.isRequired,
  dateAndTime: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    practitionerId: PropTypes.string,
  }),
  hasWaitList: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isBooking: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  notes: PropTypes.string,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  selectedPractitioner: PropTypes.oneOfType([PropTypes.instanceOf(Practitioner), PropTypes.string]),
  selectedService: PropTypes.oneOfType([PropTypes.instanceOf(Service), PropTypes.string]),
  setIsBooking: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    unavailableDates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
};

Review.defaultProps = {
  dateAndTime: {
    startDate: '',
    endDate: '',
    practitionerId: '',
  },
  notes: '',
  patientUser: null,
  selectedPractitioner: '',
  selectedService: '',
  waitlist: {
    dates: [],
    unavailableDates: [],
    times: [],
  },
};
