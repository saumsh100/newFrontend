
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
import { refreshAvailabilitiesState } from '../../../../actions/availabilities';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { officeHoursShape } from '../../../library/PropTypeShapes/officeHoursShape';
import { capitalizeFirstLetter } from '../../../Utils';
import sortAsc from '../../../../../iso/helpers/sort/sortAsc';
import { bookingConfirmedSVG } from '../../SVGs';
import styles from './styles.scss';

function Complete({
  dateAndTime,
  history,
  patientUser: { firstName, lastName },
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
  const checkForStartdate = (data, startDate) => data.includes(startDate);

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
    /**
     * Displays 'All day (starTime - endTime)'
     */
    if (availabilities.total === selected.length) {
      return `All day (${dateFormatter(selected[0], timezone, 'LT')} - ${dateFormatter(
        selected[selected.length - 1],
        timezone,
        'LT',
      )})`;
    }
    const timeframe = availabilities[value];
    const checkIfIsAllDay = timeframe.every(({ startDate }) =>
      checkForStartdate(selected, startDate));
    if (timeframe.length > 0 && checkIfIsAllDay) {
      /**
       * Displays 'Timeframe (starTime - endTime)'
       */
      const timeFrame = capitalizeFirstLetter(value);
      const startTimeOnTimeFrame = dateFormatter(timeframe[0].startDate, timezone, 'LT');
      const endTimeOnTimeFrame = dateFormatter(
        timeframe[timeframe.length - 1].startDate,
        timezone,
        'LT',
      );
      acc += ` ${timeFrame} (${startTimeOnTimeFrame} - ${endTimeOnTimeFrame}), `;
    } else {
      /**
       * Displays an inline list of
       */
      acc += ` ${timeframe
        .filter(({ startDate }) => checkForStartdate(selected, startDate))
        .map(el => dateFormatter(el.startDate, timezone, 'LT'))
        .join(', ')}, `;
    }

    return acc.slice(0, -2);
  };

  /**
   * Display a linear list of times that were selected from the user on the waitlist's steps.
   */
  const waitlistTimes = () => {
    if (waitlist.times.length === 0) {
      return null;
    }
    return Object.keys(availabilities).reduce(handleAvailabilitiesTimes(waitlist.times), '');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div>{bookingConfirmedSVG}</div>
          <h2 className={styles.heading}>Thank You!</h2>
          <p className={styles.requestTitle}>These are the details of your request:</p>
          <div className={styles.requestCard}>
            <h3 className={styles.requestPatient}>{`${firstName} ${lastName}`}</h3>
            {dateAndTime && (
              <div>
                <h4>Appointment</h4>
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
            )}
            {waitlist.dates.length > 0 && (
              <div>
                <h4>Waitlist</h4>
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
          </div>
          <p className={styles.afterCardMessage}>
            Your appointment has been successfully requested. <br />
            We will be in touch shortly. Please wait for our confirmation.
          </p>
          <div className={styles.buttonWrapper}>
            <Button
              className={styles.fullWidthButton}
              onClick={() => {
                props.refreshAvailabilitiesState();
                history.push('../book');
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

export default connect(mapStateToProps, mapDispatchToProps)(Complete);

Complete.propTypes = {
  dateAndTime: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    practitionerId: PropTypes.string,
  }),
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
