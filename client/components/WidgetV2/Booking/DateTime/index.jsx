
import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DateList from './DateList';
import {
  setConfirmAvailability,
  setIsFetching,
  setSelectedAvailability,
  setSelectedStartDate,
} from '../../../../actions/availabilities';
import Button from '../../../library/Button';
import DayPicker from '../../../library/DayPicker';
import { fetchAvailabilities } from '../../../../thunks/availabilities';
import availabilityShape from '../../../library/PropTypeShapes/availabilityShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import { bookingPickDateSVG } from '../../SVGs';
import styles from './styles.scss';
import dayPickerStyles from '../dayPickerStyles.scss';

/**
 * Checks if a date is before the currentDate.
 *
 * @param currentDate
 * @returns {function(*=): *}
 */
const generateIsDisabledDay = currentDate => date => genericMoment(date).isBefore(currentDate);

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
    .reduce(groupTimesPerPeriod, {
      morning: [],
      afternoon: [],
      evening: [],
      total: 0,
    });

/**
 * Generates the amount of days forward using the selectedStartDate.
 *
 * @param numDaysForward
 * @param selectedStartDate
 * @param accountTimezone
 */
const generateDateRange = (numDaysForward, selectedStartDate, accountTimezone) => {
  const dateRange = [];
  for (let i = 0; i < numDaysForward; i += 1) {
    dateRange.push(genericMoment(selectedStartDate, accountTimezone).add(i, 'days'));
  }
  return dateRange;
};
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
    this.joinWaitlist = this.joinWaitlist.bind(this);
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

    /**
     * Set this as false everytime to make sure that
     * we have accuracy on the availability selection.
     */
    this.props.setConfirmAvailability(false);
    if (!selectedAvailability || selectedAvailability.startDate !== availability.startDate) {
      return this.props.setSelectedAvailability(availability);
    }
    return this.props.setSelectedAvailability(null);
  }

  /**
   * Send the user to the join waitlist's prompt, after clicking on the next button.
   */
  confirmDateTime() {
    const { selectedAvailability, accountTimezone } = this.props;

    this.props.setConfirmAvailability(true);

    const currentDayPlus24 = moment()
      .tz(accountTimezone)
      .add(1, 'day')
      .toISOString();

    const nextLoc = this.props.location.state && this.props.location.state.nextRoute;

    if (selectedAvailability.startDate < currentDayPlus24) {
      return this.props.history.push(nextLoc || './patient-information');
    }

    /**
     * Checks if there are a specific route to go onclicking a card or just the default one.
     */
    return this.props.history.push(nextLoc || './waitlist/join');
  }

  /**
   * Send the user to the select waitlist's dates, after clicking on the Join Waitlist button.
   */
  joinWaitlist() {
    this.props.setConfirmAvailability(false);
    this.props.setSelectedAvailability(null);
    this.props.setSelectedStartDate(new Date());
    return this.props.history.push('./waitlist/select-dates');
  }

  render() {
    const {
      accountTimezone,
      availabilities,
      floorDate,
      isFetching,
      nextAvailability,
      selectedAvailability,
      selectedStartDate,
    } = this.props;

    const selectedDayAvailabilities = getSortedAvailabilities(
      selectedStartDate,
      availabilities,
      accountTimezone,
    );

    /**
     * What we display if there's not availabilities for today,
     * but we have a future availability.
     */
    const nextAvailabilityButton = ({ startDate }) => (
      <Button
        onClick={() => this.changeSelectedDate(startDate)}
        className={styles.nextAvailabilityButton}
      >
        Next Availablility on {genericMoment(startDate, accountTimezone).format('ddd, MMM D')}
      </Button>
    );

    /**
     * What we display when there's not availabilities for today,
     * or in the future.
     */
    const availabilitiesNotFound = (
      <div className={styles.subCard}>
        <div className={styles.subCardWrapper}>
          <h3 className={styles.subCardTitle}>No available appointments</h3>
          <p className={styles.subCardSubtitle}>
            We did not find any availabilities for your criteria.
          </p>
        </div>
        <Button className={styles.subCardLink} onClick={this.joinWaitlist}>
          Join Waitlist
        </Button>
      </div>
    );

    /**
     * Renders a single slot of time.
     *
     * @param {object} availability
     * @param {string} j
     */
    const renderTimesOnTimeFrame = (availability, index) => {
      const availabilityClasses = classNames(styles.slot, {
        [styles.selectedSlot]:
          selectedAvailability && selectedAvailability.startDate === availability.startDate,
      });
      return (
        <Button
          key={`${availability.startDate}_item_${index}`}
          onClick={() => this.selectAvailability(availability)}
          className={availabilityClasses}
        >
          {genericMoment(availability.startDate, accountTimezone).format('LT')}
        </Button>
      );
    };

    /**
     * Render the availabilities, if there is none options on the current selected date
     * it will render the next availability to the specified criteria.
     * @returns {*}
     */
    const availabilitiesDisplay = () => {
      if (!selectedDayAvailabilities.total && nextAvailability) {
        return nextAvailabilityButton(nextAvailability);
      }

      return (
        <div className={styles.subCardWrapper}>
          {selectedDayAvailabilities.morning.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.slotsTitle}>Morning</span>
              {selectedDayAvailabilities.morning.map(renderTimesOnTimeFrame)}
            </div>
          )}
          {selectedDayAvailabilities.afternoon.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.slotsTitle}>Afternoon</span>
              {selectedDayAvailabilities.afternoon.map(renderTimesOnTimeFrame)}
            </div>
          )}
          {selectedDayAvailabilities.evening.length > 0 && (
            <div className={styles.timeFrameWrapper}>
              <span className={styles.slotsTitle}>Evening</span>
              {selectedDayAvailabilities.evening.map(renderTimesOnTimeFrame)}
            </div>
          )}
          <Button
            disabled={!selectedAvailability}
            className={styles.fullWidthButton}
            onClick={this.confirmDateTime}
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
        <availabilitiesNotFound />
      ) : (
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3 className={styles.title}>Select Time</h3>
            <p className={styles.subtitle}>Select a time that works best for you</p>
            {isFetching ? (
              <div className={styles.spinnerWrapper}>
                <i className="fas fa-spinner fa-spin fa-3x fa-fw" />
                <h3>Loading availabilities…</h3>
              </div>
            ) : (
              <div className={styles.availabilitiesWrapper}>{availabilitiesDisplay()}</div>
            )}
          </div>
          <div className={styles.subCard}>
            <div className={styles.subCardWrapper}>
              <h3 className={styles.subCardTitle}>Want to come in sooner?</h3>
              <p className={styles.subCardSubtitle}>
                Be notified when an earlier appointment becomes available
              </p>
            </div>
            <Button className={styles.subCardLink} onClick={this.joinWaitlist}>
              Join Waitlist
            </Button>
          </div>
        </div>
      ));

    /**
     * HTML that displays the Pick a Date button.
     *
     * @param props
     * @returns {*}
     */
    const CalendarButtonTrigger = props => (
      <Button {...props} className={styles.datePicker}>
        {bookingPickDateSVG}
        Pick a<br /> Date
      </Button>
    );

    return (
      <div className={styles.container}>
        <div className={styles.topWrapper}>
          <DateList
            dayAvailabilities={generateDateRange(3, selectedStartDate, accountTimezone)}
            selectDate={selectedStartDate}
            onDateChange={this.changeSelectedDate}
          />
          <DayPicker
            value={selectedStartDate}
            target="custom"
            TargetComponent={CalendarButtonTrigger}
            tipSize={0.01}
            onChange={this.changeSelectedDate}
            disabledDays={generateIsDisabledDay(floorDate)}
            theme={dayPickerStyles}
          />
        </div>
        {renderAvailabilities()}
      </div>
    );
  }
}

function mapStateToProps({ availabilities }) {
  return {
    accountTimezone: availabilities.get('account').get('timezone'),
    availabilities: availabilities.get('availabilities'),
    floorDate: availabilities.get('floorDate'),
    isFetching: availabilities.get('isFetching'),
    nextAvailability: availabilities.get('nextAvailability'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedStartDate: availabilities.get('selectedStartDate'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchAvailabilities,
      setConfirmAvailability,
      setIsFetching,
      setSelectedAvailability,
      setSelectedStartDate,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);

DateTime.propTypes = {
  accountTimezone: PropTypes.string.isRequired,
  availabilities: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.array]),
  fetchAvailabilities: PropTypes.func.isRequired,
  floorDate: PropTypes.string.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  nextAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  selectedAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  selectedStartDate: PropTypes.string,
  setConfirmAvailability: PropTypes.func.isRequired,
  setSelectedAvailability: PropTypes.func.isRequired,
  setSelectedStartDate: PropTypes.func.isRequired,
};

DateTime.defaultProps = {
  availabilities: [],
  nextAvailability: '',
  selectedAvailability: '',
  selectedStartDate: '',
};
