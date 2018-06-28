
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
import styles from './styles.scss';

function Review({
  dateAndTime,
  hasWaitList,
  history,
  isBooking,
  location,
  notes,
  officeHours,
  patientUser,
  selectedPractitioner,
  selectedService,
  timezone,
  waitlist,
  ...props
}) {
  const dateFormatter = (value, format = 'LT') => moment.tz(value, timezone).format(format);
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
      .then(data => console.log('data', data))
      .catch(err => console.error('Creating request failed', err));
  };

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
        <p>{value}</p>
        <Button
          className={styles.editLink}
          onClick={() => {
            if (!isBooking) {
              props.setIsBooking(true);
            }
            return history.push({ pathname: link, state: { nextRoute: goBack } });
          }}
        >
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
          </svg>
        </Button>
      </span>
    </div>
  );

  /**
   * Display the dates selected on the waitlist's steps.
   * If is a regular range display the first and the last day,
   * otherwise display a list of dates.
   */
  const waitlistDates = () => {
    if (waitlist.dates.length === 0) {
      return null;
    }
    const firstDate = dateFormatter(waitlist.dates[0], 'MMM Do');
    const lastDate = dateFormatter(waitlist.dates[waitlist.dates.length - 1], 'MMM Do');
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
      .sort((a, b) => (a < b ? -1 : 1))
      .map(value => dateFormatter(value, 'MMM Do'))
      .join(', ');
  };

  /**
   * Display a linear list of times that were selected from the user on the waitlist's steps.
   */
  const waitlistTimes = () => {
    if (waitlist.times.length === 0) {
      return null;
    }

    /**
     * Checks if the passed array contains the
     * specified string.
     *
     * @param {array} data
     * @param {string} startDate
     */
    const checkIfItContains = (data, startDate) => data.includes(startDate);

    /**
     * With the provided array of strings,
     * build the text tha will be displayed on the Review's page.
     *
     * @param {array} selected
     */
    const handleAvailabilitiesTimes = selected => (acc, value) => {
      /**
       * Displays 'All day (starTime - endTime)'
       */
      if (availabilities.total === selected.length) {
        return `All day (${dateFormatter(selected[0])} - ${dateFormatter(selected[selected.length - 1])})`;
      }
      const timeframe = availabilities[value];
      const checkIfIsAllDay = timeframe.every(({ startDate }) =>
        checkIfItContains(selected, startDate));
      if (timeframe.length > 0 && checkIfIsAllDay) {
        /**
         * Displays 'Timeframe (starTime - endTime)'
         */
        const timeFrame = capitalizeFirstLetter(value);
        const startTimeOnTimeFrame = dateFormatter(timeframe[0].startDate);
        const endTimeOnTimeFrame = dateFormatter(timeframe[timeframe.length - 1].startDate);
        acc += ` ${timeFrame} (${startTimeOnTimeFrame} - ${endTimeOnTimeFrame}), `;
      } else {
        /**
         * Displays an inline list of
         */
        acc += ` ${timeframe
          .filter(({ startDate }) => checkIfItContains(selected, startDate))
          .map(el => dateFormatter(el.startDate))
          .join(', ')}, `;
      }

      return acc.slice(0, -2);
    };

    return Object.keys(availabilities).reduce(handleAvailabilitiesTimes(waitlist.times), '');
  };
  /**
   * Check if the user is on the Review's route
   * or just on the summary tab.
   * If it's on the Review's page set the return the path passed,
   * otherwise just return false.
   *
   * @param {string} path
   */
  const contextualUrl = (path) => {
    const match = matchPath(location.pathname, {
      path: '/widgets/:accountId/app/book/review',
      exact: true,
    });

    if (!match) {
      return false;
    }
    return path;
  };

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
                contextualUrl('./review'),
              )}
              {renderSummaryItem(
                'Available Dates',
                waitlistDates(),
                './waitlist/select-dates',
                contextualUrl('../review'),
              )}
              {renderSummaryItem(
                'Unavailable Dates',
                waitlistUnavailableDates(),
                './waitlist/days-unavailable',
                contextualUrl('../review'),
              )}
              {renderSummaryItem(
                'Times',
                waitlistTimes(),
                './waitlist/select-times',
                contextualUrl('../review'),
              )}
            </div>
          ) : (
            <div>
              <p className={styles.subtitle}>Looks like you did not set any waitlist</p>
              <Button
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
          {renderSummaryItem(
            'Practitioner',
            (selectedPractitioner && selectedPractitioner.getPrettyName()) || 'No Preference',
            './practitioner',
            contextualUrl('./review'),
          )}
          {selectedService.get('name') &&
            renderSummaryItem(
              'Reason',
              selectedService.get('name'),
              './reason',
              contextualUrl('./review'),
            )}
          {dateAndTime &&
            renderSummaryItem(
              'Date and Time',
              `${dateFormatter(dateAndTime.startDate, 'ddd, MMM Do')} at ${dateFormatter(
                dateAndTime.startDate,
                'h:mm a',
              )}`,
              './date-and-time',
              contextualUrl('./review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Patient',
              `${patientUser.firstName} ${patientUser.lastName}`,
              './patient-information',
              contextualUrl('./review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Insurance Carrier',
              `${patientUser.insuranceCarrier || 'Not provided'}`,
              './patient-information',
              contextualUrl('./review'),
            )}
          {patientUser &&
            renderSummaryItem(
              'Insurance Member ID & Group ID',
              `${patientUser.insuranceMemberId ||
                'Not provided'} - ${patientUser.insuranceGroupId || 'Not provided'}`,
              './patient-information',
              contextualUrl('./review'),
            )}

          {patientUser &&
            renderSummaryItem(
              'Notes',
              `${notes || 'Not provided'}`,
              './additional-information',
              contextualUrl('./review'),
            )}
        </div>
        <Button className={styles.fullWidthButton} onClick={() => submitRequest()}>
          Confirm Booking
        </Button>
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

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review));

Review.propTypes = {
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
