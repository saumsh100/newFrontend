
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import difference from 'lodash/difference';
import { Button } from '../../../../library';
import Service from '../../../../../entities/models/Service';
import { setWaitlistTimes } from '../../../../../actions/availabilities';
import { historyShape } from '../../../../library/PropTypeShapes/routerShapes';
import officeHoursShape from '../../../../library/PropTypeShapes/officeHoursShape';
import createAvailabilitiesFromOpening from '../../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import styles from './styles.scss';

function SelectTimes({
  selectedService,
  officeHours,
  waitlist,
  timezone,
  setWaitlist,
  history,
}) {
  /**
   * Return the correct moment object checking if there's a timezone before.
   *
   * @param time
   * @param tz
   * @returns {*}
   */
  const genericMoment = (time, tz) => (tz ? moment.tz(time, tz) : moment(time));

  /**
   * Add the current.startDate to the accumulator.
   *
   * @param {array} acc
   * @param {object} current
   */
  const reduceStartTime = (acc, current) => (acc = [...acc, current.startDate]);

  /**
   * Check if the passed startDate is included on the already selected waitlist times.
   *
   * @param {object} startDate
   */
  const checkIfIncludesTime = ({ startDate }) =>
    waitlist.times.includes(startDate);

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
    endDate: moment(latestEndTime),
    duration: selectedService.get('duration'),
    interval: 60,
  }).reduce(
    (acc, act, index) => {
      const splitAfternoon = 12;
      const splitEvening = 17;
      const currentHour = parseFloat(genericMoment(act.startDate, timezone).format('HH'));

      if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
        acc = { ...acc, afternoon: [...acc.afternoon, act], total: index + 1 };
      } else if (currentHour >= splitEvening) {
        acc = { ...acc, evening: [...acc.evening, act], total: index + 1 };
      } else {
        acc = { ...acc, morning: [...acc.morning, act], total: index + 1 };
      }

      return acc;
    },
    {
      morning: [], afternoon: [], evening: [], total: 0,
    },
  );

  /**
   * Renders the title, value and edit button for the provided data.
   *
   * @param {string} key
   * @param {string} value
   * @param {string} link
   */
  const renderSummaryItem = (key, value, link, goBack) => (
    <p className={styles.waitlistIndex}>
      <span className={styles.waitlistKey}>{key}</span>
      <span className={styles.waitlistValue}>
        {value}
        <Button
          className={styles.editLink}
          onClick={() =>
            history.push({ pathname: link, state: { nextRoute: goBack } })
          }
        >
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
          </svg>
        </Button>
      </span>
    </p>
  );

  /**
   * Return a button scoped to a specific time-frame
   *
   * @param {string} frame
   * @param {string} label
   */
  const timeFrameButton = (frame, label) => {
    const classes = classnames(styles.slot, styles.timeFrameButton, {
      [styles.selectedSlot]:
        (availabilities[frame] &&
          availabilities[frame].length > 0 &&
          availabilities[frame].every(checkIfIncludesTime)) ||
        availabilities.total === waitlist.times.length,
    });
    return (
      <Button
        className={classes}
        onClick={() => handleSelectFrameAvailability(frame)}
      >
        {label}
      </Button>
    );
  };

  /**
   * Handle what we have to select in comparison to what
   * is already selected.
   * If clicked 'All Day', checks if all values are selected, if they are toggle all off,
   * otherwise select every available time.
   * If the user clicked a specific time-frame such as 'Afternoon',
   * check if all values in this time-frame are already selected, if they are toggle all off,
   * otherwise select the only those that are not selected yet.
   *
   * @param {string} frame
   */
  const handleSelectFrameAvailability = (frame) => {
    let selectedAvailabilities = [];
    if (frame === 'all') {
      selectedAvailabilities =
        availabilities.total === waitlist.times.length
          ? []
          : [
            ...availabilities.morning.reduce(reduceStartTime, []),
            ...availabilities.afternoon.reduce(reduceStartTime, []),
            ...availabilities.evening.reduce(reduceStartTime, []),
          ];
    } else {
      const frameTimes = availabilities[frame].reduce(reduceStartTime, []);
      selectedAvailabilities = availabilities[frame].every(checkIfIncludesTime)
        ? difference(waitlist.times, frameTimes)
        : [...waitlist.times, ...difference(frameTimes, waitlist.times)];
    }
    return setWaitlist(selectedAvailabilities);
  };

  /**
   * Check if a specific availability is already selected,
   * if it is unselected it, otherwise select it.
   *
   * @param {string} availability
   */
  const handleAvailability = (availability) => {
    let times = [];
    if (checkIfIncludesTime(availability)) {
      times = waitlist.times.filter(value => value !== availability.startDate);
    } else {
      times = [...waitlist.times, availability.startDate];
    }
    return setWaitlist(times);
  };

  /**
   * Loop a list of time-slots if there is times on the time frame.
   *
   * @param {array} timeframe
   * @param {string} label
   */
  const timeListOnFrame = (timeframe, label) =>
    timeframe &&
    timeframe.length > 0 && (
      <div className={styles.timeListWrapper}>
        <h3 className={styles.slotsTitle}>{label}</h3>
        {timeframe.map((availability, index) => {
          const classes = classnames(styles.slot, {
            [styles.selectedSlot]: checkIfIncludesTime(availability),
          });
          return (
            <Button
              key={`${availability.startDate}_item_${index}`}
              onClick={() => handleAvailability(availability)}
              className={classes}
            >
              {genericMoment(availability.startDate, timezone).format('LT')}
            </Button>
          );
        })}
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Waitlist Summary</h3>
        <p className={styles.subtitle}>
          Here are the informations that you already defined to your
          appointment.
        </p>
        {renderSummaryItem(
          'Reason',
          selectedService.get('name'),
          '../reason',
          './waitlist/select-times',
        )}
        {renderSummaryItem(
          'Days on Waitlist',
          `${waitlist.dates[0]} > ${waitlist.dates[waitlist.dates.length - 1]}`,
          './select-dates',
          './select-times',
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Select Times</h3>
        <p className={styles.subtitle}>
          Select the times you are available to come for an earlier appointment.
          (Select all that apply)
        </p>
        <div className={styles.timeFrameWrapper}>
          {timeFrameButton('all', 'All Day')}
          {availabilities.morning.length > 0 &&
            timeFrameButton('morning', 'Morning')}
          {availabilities.afternoon.length > 0 &&
            timeFrameButton('afternoon', 'Afternoon')}
          {availabilities.evening.length > 0 &&
            timeFrameButton('evening', 'Evening')}
        </div>
        <div>
          <span className={styles.helper}>Or</span>
          {timeListOnFrame(availabilities.morning, 'Morning')}
          {timeListOnFrame(availabilities.afternoon, 'Afternoon')}
          {timeListOnFrame(availabilities.evening, 'Evening')}
        </div>
        <Button
          disabled={!waitlist.times.length}
          className={styles.fullWidthButton}
          onClick={() => history.push('./remove-dates')}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps({ availabilities, entities }) {
  return {
    timezone: availabilities.get('account').get('timezone'),
    waitlist: availabilities.get('waitlist').toJS(),
    officeHours: availabilities.get('officeHours').toJS(),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWaitlist: setWaitlistTimes,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectTimes);

SelectTimes.propTypes = {
  timezone: PropTypes.string,
  setWaitlist: PropTypes.func,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
  history: PropTypes.shape(historyShape),
  officeHours: PropTypes.shape(officeHoursShape),
  selectedService: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Service),
  ]),
};
