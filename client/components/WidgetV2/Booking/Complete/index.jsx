
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '../../../library';
import createAvailabilitiesFromOpening from '../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import dateFormatter from '../../../../../iso/helpers/dateTimezone/dateFormatter';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import { setDateToTimezone } from '../../../../../server/util/time';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { refreshAvailabilitiesState } from '../../../../actions/availabilities';
import { officeHoursShape } from '../../../library/PropTypeShapes/officeHoursShape';
import { capitalizeFirstLetter } from '../../../Utils';
import sortAsc from '../../../../../iso/helpers/sort/sortAsc';
import { BookingConfirmedSVG } from '../../SVGs';
import styles from './styles.scss';
import toHumanCommaSeparated from '../../../../../iso/helpers/string/toHumanCommaSeparated';
import dateFormatterFactory from '../../../../../iso/helpers/dateTimezone/dateFormatterFactory';

function Complete({
  dateAndTime,
  history,
  location,
  patientUser,
  selectedService,
  officeHours,
  selectedPractitioner,
  timezone,
  waitlist,
  ...props
}) {
  /**
   * Look over the officeHours object and find the earliest startTime of the clinic.
   */
  const earliestStartTime = Object.values(officeHours).reduce((acc, curr) => {
    if (!acc || (acc && curr && curr.startTime && curr.startTime < acc)) {
      acc = curr.startTime;
    }
    return acc;
  });

  /**
   * Look over the officeHours object and find the latest endTime of the clinic.
   */
  const latestEndTime = Object.values(officeHours).reduce((acc, curr) => {
    if (!acc || (acc && curr && curr.endTime && curr.endTime > acc)) {
      acc = curr.endTime;
    }
    return acc;
  });

  /**
   * Generates the availabilities using the office openings,
   * also group them inside the specific time-frame.
   */
  const availabilities = createAvailabilitiesFromOpening({
    startDate: earliestStartTime,
    endDate: setDateToTimezone(latestEndTime, timezone),
    duration: selectedService.get('duration'),
    interval: 60,
  }).reduce(groupTimesPerPeriod, {
    morning: [],
    afternoon: [],
    evening: [],
    total: 0,
  });

  /**
   * Display the dates selected on the waitlist's steps.
   * If is a regular range display the first and the last day,
   * otherwise display a list of dates.
   */
  const waitlistDates = () => {
    if (waitlist.dates.length === 0) {
      return null;
    }
    const firstDate = dateFormatter(waitlist.dates[0], timezone, 'MMM Do');
    const lastDate = dateFormatter(waitlist.dates[waitlist.dates.length - 1], timezone, 'MMM Do');
    /**
     * It shows the days that are on the waitlist.
     */
    return `From: ${firstDate} - To: ${lastDate}`;
  };
  const waitlistUnavailableDates = () => {
    if (waitlist.unavailableDates.length === 0) {
      return 'Not Provided';
    }
    /**
     * It shows the days that are on the unavailableDates list.
     */
    return waitlist.unavailableDates
      .sort(sortAsc)
      .map(value => dateFormatter(value, timezone, 'MMM Do'))
      .join(', ');
  };

  /**
   * Checks if the passed array contains the
   * specified string.
   *
   * @param {array} data
   * @param {string} startDate
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
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.svgWrapper}>
            <BookingConfirmedSVG />
          </div>
          <h1 className={styles.heading}>
            Thank You, {patientUser && `${patientUser.firstName} ${patientUser.lastName}`}!
          </h1>
          <p className={styles.description}>
            Your request has been successfully created. <br />
            We will be in touch soon, please wait for our confirmation.
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {dateAndTime && (
            <div className={styles.rowCard}>
              <div className={styles.bookingGroup}>
                <h4 className={styles.bookingType}>{"Appointment's Details"}:</h4>
                <p className={styles.requestInfo}>
                  <strong>Date:</strong>{' '}
                  {`${dateFormatter(
                    dateAndTime.startDate,
                    timezone,
                    'dddd, MMM Do',
                  )} at ${dateFormatter(dateAndTime.startDate, timezone, 'h:mm a')}`}
                </p>
                {selectedPractitioner &&
                  selectedPractitioner.getPrettyName() && (
                    <p className={styles.requestInfo}>
                      <strong>Practitioner:</strong> {selectedPractitioner.getPrettyName()}
                    </p>
                  )}
                <p className={styles.requestInfo}>
                  <strong>Reason:</strong> {selectedService.get('name')}
                </p>
              </div>
            </div>
          )}

          {waitlist.dates.length > 0 && (
            <div className={styles.rowCard}>
              <h4 className={styles.bookingType}>{"Waitlist's Details"}:</h4>
              <p className={styles.requestInfo}>
                <strong>Reason:</strong> {selectedService.get('name')}
              </p>
              <p className={styles.requestInfo}>
                <strong>Available Dates:</strong> {waitlistDates()}
              </p>
              <p className={styles.requestInfo}>
                <strong>Unavailable Dates:</strong> {waitlistUnavailableDates()}
              </p>
              <p className={styles.requestInfo}>
                <strong>Available Times:</strong> {waitlistTimes()}
              </p>
            </div>
          )}
          <div className={styles.contentWrapper}>
            <Button
              className={styles.actionButton}
              onClick={() => {
                props.refreshAvailabilitiesState();
                history.push({
                  ...location,
                  pathname: '../book/reason',
                  state: {
                    ...location.state,
                    isCompleteRoute: false,
                  },
                });
              }}
            >
              Start New Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ auth, availabilities, entities }) {
  const getPatientUser = auth
    .get('familyPatients')
    .find(patient => patient.id === availabilities.get('familyPatientUser'));
  return {
    dateAndTime: availabilities.get('selectedAvailability'),
    officeHours: availabilities.get('officeHours').toJS(),
    timezone: availabilities.get('account').get('timezone'),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    selectedPractitioner: entities.getIn([
      'practitioners',
      'models',
      availabilities.get('selectedPractitionerId'),
    ]),
    patientUser: getPatientUser,
    waitlist: availabilities.get('waitlist').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      refreshAvailabilitiesState,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Complete);

Complete.propTypes = {
  dateAndTime: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    practitionerId: PropTypes.string,
  }),
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  selectedPractitioner: PropTypes.oneOfType([PropTypes.instanceOf(Practitioner), PropTypes.string]),
  selectedService: PropTypes.oneOfType([PropTypes.instanceOf(Service), PropTypes.string]),
  timezone: PropTypes.string.isRequired,
  refreshAvailabilitiesState: PropTypes.func.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    unavailableDates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
};

Complete.defaultProps = {
  dateAndTime: {
    startDate: '',
    endDate: '',
    practitionerId: '',
  },
  patientUser: null,
  selectedPractitioner: '',
  selectedService: '',
  waitlist: {
    dates: [],
    unavailableDates: [],
    times: [],
  },
};
