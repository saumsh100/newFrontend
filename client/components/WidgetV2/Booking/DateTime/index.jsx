
import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateList from './DateList';
import Link from '../../../library/Link';
import {
  setSelectedStartDate,
  setSelectedAvailability,
  setIsFetching,
} from '../../../../actions/availabilities';
import Button from '../../../library/Button';
import DayPicker from '../../../library/DayPicker';
import { fetchAvailabilities } from '../../../../thunks/availabilities';
import accountShape from '../../../library/PropTypeShapes/accountShape';
import availabilityShape from '../../../library/PropTypeShapes/availabilityShape';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

/**
 * Checks if a date is before the currentDate.
 *
 * @param currentDate
 * @returns {function(*=): *}
 */
const generateIsDisabledDay = currentDate => date => moment(date).isBefore(currentDate);

/**
 * Loop a list of Moment object and
 * check if the provided date is the same day,
 * taking in consideration the account's timezone.
 * It also group times that are on the same timeframe (morning, afternoon, evening).
 *
 * @param momentDate
 * @param availabilities
 * @param accountTimezone
 * @returns {*}
 */
const getSortedAvailabilities = (selectedDate, availabilities, accountTimezone) =>
  availabilities
    .filter(date => genericMoment(date.startDate, accountTimezone).isSame(selectedDate, 'd'))
    .reduce(
      (acc, act) => {
        const splitAfternoon = 12;
        const splitEvening = 17;
        const currentHour = parseFloat(moment(act.startDate).format('HH'));

        if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
          acc = { ...acc, afternoon: [...acc.afternoon, act] };
        } else if (currentHour >= splitEvening) {
          acc = { ...acc, evening: [...acc.evening, act] };
        } else {
          acc = { ...acc, morning: [...acc.morning, act] };
        }

        return acc;
      },
      { morning: [], afternoon: [], evening: [], total: availabilities.length }
    );

/**
 * Generates the amount of days forward using the selectedStartDate.
 *
 * @param numDaysForward
 * @param selectedStartDate
 * @param accountTimezone
 */
const generateDateRange = (numDaysForward, selectedStartDate, accountTimezone) =>
  Array(numDaysForward)
    .fill()
    .reduce(
      (acc, act, i) => [...acc, genericMoment(selectedStartDate, accountTimezone).add(i, 'days')],
      []
    );

/**
 * Return the correct moment object checking if there's a timezone before.
 *
 * @param time
 * @param timezone
 * @returns {*}
 */
const genericMoment = (time, timezone) => (timezone ? moment.tz(time, timezone) : moment(time));

class DateTime extends Component {
  constructor(props) {
    super(props);

    this.confirmDateTime = this.confirmDateTime.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.selectAvailability = this.selectAvailability.bind(this);
  }

  componentWillMount() {
    this.props.fetchAvailabilities();
  }

  /**
   * Fetch availabilities if the new selectedStartDate is different than the existent one.
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedStartDate !== this.props.selectedStartDate) {
      this.props.fetchAvailabilities();
    }
  }

  /**
   * If the provided date is different than the actual selectedStartDate,
   * set the new date.
   *
   * @param date
   */
  changeSelectedDate(date) {
    if (date !== this.props.selectedStartDate) {
      this.props.setSelectedStartDate(date);
    }
  }

  /**
   * If the provided availability is different than the actual selectedAvailability,
   * set the new availability, otherwise uncheck the current selected availability.
   * @param availability
   */
  selectAvailability(availability) {
    const { selectedAvailability } = this.props;
    if (!selectedAvailability || selectedAvailability.startDate !== availability.startDate) {
      return this.props.setSelectedAvailability(availability);
    }
    return this.props.setSelectedAvailability(null);
  }

  /**
   * Send the user to the join waitlist's prompt, after clicking on the next button.
   */
  confirmDateTime() {
    return this.props.history.push('./waitlist/join');
  }

  render() {
    const {
      selectedStartDate,
      selectedAvailability,
      nextAvailability,
      floorDate,
      availabilities,
      account,
      isFetching,
    } = this.props;

    const dayAvailabilities = generateDateRange(5, selectedStartDate, account.timezone);
    const selectedDayAvailabilities = getSortedAvailabilities(
      selectedStartDate,
      availabilities,
      account.timezone
    );

    /**
     * Render the availabilities, if there is none options on the current selected date
     * it will render the next availability to the specified criteria.
     * @returns {*}
     */
    const availabilitiesDisplay = () => {
      if (!selectedDayAvailabilities.total && nextAvailability) {
        const { startDate } = nextAvailability;
        return (
          <Button
            onClick={() => this.changeSelectedDate(startDate)}
            className={styles.nextAvailabilityButton}
          >
            Next Availablility on {genericMoment(startDate, account.timezeone).format('ddd, MMM D')}
          </Button>
        );
      }

      /**
       * Renders a single slot of time.
       *
       * @param {object} availability
       * @param {string} j
       */
      const renderTimesOnTimeFrame = (availability, index) => {
        const availabilityClasses = classNames(styles.timeSlot, {
          [styles.selectedTimeSlot]:
            selectedAvailability && selectedAvailability.startDate === availability.startDate,
        });
        return (
          <Button
            key={`${availability.startDate}_item_${index}`}
            onClick={() => this.selectAvailability(availability)}
            className={availabilityClasses}
          >
            {genericMoment(availability.startDate, account.timezeone).format('h:mm a')}
          </Button>
        );
      };

      return (
        <div className={styles.waitlistWrapper}>
          {selectedDayAvailabilities.morning.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.timeFrameTitle}>Morning</span>
              {selectedDayAvailabilities.morning.map(renderTimesOnTimeFrame)}
            </div>
          )}
          {selectedDayAvailabilities.afternoon.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.timeFrameTitle}>Afternoon</span>
              {selectedDayAvailabilities.afternoon.map(renderTimesOnTimeFrame)}
            </div>
          )}
          {selectedDayAvailabilities.evening.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.timeFrameTitle}>Evening</span>
              {selectedDayAvailabilities.evening.map(renderTimesOnTimeFrame)}
            </div>
          )}
          <Button
            disabled={!selectedAvailability}
            className={styles.nextButton}
            onClick={() => this.confirmDateTime()}
          >
            Next
          </Button>
        </div>
      );
    };

    /**
     * Checks if we have at least a single valid availability,
     * it can be on the current selected date or in a future date,
     * if there is none availabilities invite the user to join the waitlist.
     *
     * @returns {*}
     */
    const renderAvailabilities = () =>
      (!selectedDayAvailabilities.length && !nextAvailability ? (
        <Link to={'./waitlist/select-date'} className={styles.waitlist}>
          <div className={styles.waitlistWrapper}>
            <h3 className={styles.waitlistTitle}>No available appointments</h3>
            <p className={styles.waitlistSubtitle}>
              We did not find any availabilities for your criteria.
            </p>
          </div>
          <span className={styles.waitlistLink}>Join Waitlist</span>
        </Link>
      ) : (
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3 className={styles.title}>Select Time</h3>
            <p className={styles.subtitle}>Select a time that works best for you</p>
            <div className={styles.availabilitiesWrapper}>{availabilitiesDisplay()}</div>
          </div>
          <Link to={'./waitlist/select-date'} className={styles.waitlist}>
            <div className={styles.waitlistWrapper}>
              <h3 className={styles.waitlistTitle}>Want to come in sooner?</h3>
              <p className={styles.waitlistSubtitle}>
                Be notified when an earlier appointment becomes available
              </p>
            </div>
            <span className={styles.waitlistLink}>Join Waitlist</span>
          </Link>
        </div>
      ));

    /**
     * HTML that displays the Pick a Date button.
     *
     * @param props
     * @returns {*}
     */
    const CalendarButtonTrigger = props => (
      <div {...props} className={styles.datePicker}>
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14">
          <path d="M10.684 1.332h-.667V0H8.68v1.332H3.34V0H2.003v1.332h-.667c-.742 0-1.33.6-1.33 1.333L0 11.99c0 .733.594 1.332 1.336 1.332h9.348c.735 0 1.336-.6 1.336-1.332V2.665c0-.733-.601-1.333-1.336-1.333zm0 10.659H1.336V4.663h9.348v7.328z" />
        </svg>
        Pick a <br /> Date
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.topWrapper}>
          <DateList
            dayAvailabilities={dayAvailabilities}
            selectDate={selectedStartDate}
            onChangeDate={this.changeSelectedDate}
          />
          <DayPicker
            value={selectedStartDate}
            target="custom"
            TargetComponent={CalendarButtonTrigger}
            tipSize={0.01}
            onChange={this.changeSelectedDate}
            disabledDays={generateIsDisabledDay(floorDate)}
          />
        </div>
        {isFetching ? (
          <div>
            <i className={'fas fa-spinner fa-spin fa-3x fa-fw'} />
          </div>
        ) : (
          renderAvailabilities()
        )}
      </div>
    );
  }
}

function mapStateToProps({ availabilities }) {
  const account = availabilities.get('account').toJS();
  return {
    floorDate: availabilities.get('floorDate'),
    isFetching: availabilities.get('isFetching'),
    availabilities: availabilities.get('availabilities'),
    nextAvailability: availabilities.get('nextAvailability'),
    selectedStartDate: availabilities.get('selectedStartDate'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    account,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setIsFetching,
      fetchAvailabilities,
      setSelectedStartDate,
      setSelectedAvailability,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);

DateTime.propTypes = {
  isFetching: PropTypes.bool,
  floorDate: PropTypes.string,
  fetchAvailabilities: PropTypes.func,
  setSelectedStartDate: PropTypes.func,
  selectedStartDate: PropTypes.string,
  selectedAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  account: PropTypes.shape(accountShape),
  setSelectedAvailability: PropTypes.func,
  history: PropTypes.shape(historyShape),
  nextAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  availabilities: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.array]),
};
