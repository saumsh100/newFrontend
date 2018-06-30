
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
          <div>
            <svg width="145" height="104" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <g transform="translate(34 32)" stroke="var(--primaryColor)">
                  <rect fill="#FFF" x=".5" y="7.5" width="74" height="64" rx="4" />
                  <path
                    d="M.5 24.5h74V11A3.5 3.5 0 0 0 71 7.5H4A3.5 3.5 0 0 0 .5 11v13.5z"
                    fill="#FFF"
                  />
                  <g transform="translate(11)" fill="#FFF">
                    <rect x=".5" y=".5" width="4.855" height="17" rx="2.428" />
                    <rect x="48.645" y=".5" width="4.855" height="17" rx="2.428" />
                  </g>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M25 46.803l9.839 10.24L55.059 36"
                  />
                </g>
                <g opacity=".5" transform="translate(0 -4)">
                  <circle stroke="var(--primaryColor)" cx="123" cy="18" r="3" />
                  <circle stroke="var(--primaryColor)" cx="122.5" cy="62.5" r="2.5" />
                  <circle fill="var(--primaryColor)" cx="103.5" cy="12.5" r="1.5" />
                  <circle fill="var(--primaryColor)" cx="120" cy="36" r="2" />
                  <circle fill="var(--primaryColor)" cx="57.5" cy="25.5" r="1.5" />
                  <circle fill="var(--primaryColor)" cx="12.5" cy="66.5" r="1.5" />
                  <circle fill="var(--primaryColor)" cx="1" cy="51" r="1" />
                  <circle stroke="var(--primaryColor)" cx="21" cy="51" r="3" />
                  <circle stroke="var(--primaryColor)" cx="34" cy="13" r="3" />
                  <circle stroke="var(--primaryColor)" cx="85" cy="26" r="2" />
                  <g stroke="var(--primaryColor)" strokeLinecap="round">
                    <path d="M139.717 40.55l.507 8.68M144.282 44.833h-8.493" />
                  </g>
                  <g stroke="var(--primaryColor)" strokeLinecap="round">
                    <path d="M73.717 4.55l.507 8.68M78.282 8.833h-8.493" />
                  </g>
                  <g stroke="var(--primaryColor)" strokeLinecap="round">
                    <path d="M14.04 27.55l.506 8.68M18.604 31.833h-8.493" />
                  </g>
                </g>
              </g>
            </svg>
          </div>
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
