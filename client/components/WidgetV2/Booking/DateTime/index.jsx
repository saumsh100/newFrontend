
import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CSSTransition } from 'react-transition-group';
import { Element, scroller } from 'react-scroll';
import { stringify, parse } from 'query-string';
import {
  setConfirmAvailability,
  setSelectedAvailability,
  setSelectedStartDate,
  setTimeFrame,
} from '../../../../actions/availabilities';
import Button from '../../../library/Button';
import DayPicker from '../../../library/DayPicker';
import Join from '../Waitlist/Join';
import { fetchAvailabilities } from '../../../../thunks/availabilities';
import { showButton, hideButton, setIsClicked } from '../../../../reducers/widgetNavigation';
import availabilityShape from '../../../library/PropTypeShapes/availabilityShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import { Link } from '../../../library';
import { isResponsive } from '../../../../util/hub';
import transitions from './transitions.scss';
import dayPickerStyles from '../dayPickerStyles.scss';
import styles from './styles.scss';

/**
 * Loop a list of Moment object and
 * check if the provided date is the same day,
 * taking in consideration the account's timezone.
 * It also group times that are on the same timeframe (morning, afternoon, evening).
 *
 * @param selectedDate
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

    this.state = {
      isModal: false,
    };

    this.confirmDateTime = this.confirmDateTime.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.selectAvailability = this.selectAvailability.bind(this);
    this.joinWaitlist = this.joinWaitlist.bind(this);
    this.handleClosingModal = this.handleClosingModal.bind(this);
  }

  componentDidMount() {
    const { timeframe } = parse(this.props.location.search);

    const finalTimeFrame = timeframe || this.props.timeframe;
    if (finalTimeFrame && finalTimeFrame !== '') {
      setTimeout(() => {
        this.scrollTo(finalTimeFrame);
      }, 100);
    }

    // This can be removed when the new booking widget is released
    if (!this.props.nextAvailability && this.props.availabilities.total === 0) {
      this.props.setSelectedStartDate('');
    }

    if (
      this.props.selectedAvailability !== null &&
      (!!this.props.availabilities.total && !!this.props.selectedAvailability)
    ) {
      this.props.showButton();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.confirmDateTime();
    }
  }

  componentWillUnmount() {
    this.props.hideButton();
  }

  /**
   * If the provided date is different than the actual selectedStartDate,
   * set the new date.
   *
   * @param date
   */
  changeSelectedDate(date) {
    if (!moment.tz(date, this.props.accountTimezone).isSame(this.props.selectedStartDate, 'day')) {
      this.props.hideButton();
      this.props.setSelectedAvailability(null);
      this.props.setSelectedStartDate(date);
      this.props.fetchAvailabilities();
    }
  }

  handleClosingModal() {
    return this.setState({ isModal: false });
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
      this.props.showButton();
      return this.props.setSelectedAvailability(availability);
    }
    this.props.setTimeFrame(null);
    this.props.hideButton();
    return this.props.setSelectedAvailability(null);
  }

  /**
   * Send the user to the join waitlist's prompt, after clicking on the next button.
   */
  confirmDateTime() {
    const { selectedAvailability, accountTimezone } = this.props;

    this.props.setConfirmAvailability(true);

    const nextLoc = this.props.location.state && this.props.location.state.nextRoute;
    if (nextLoc) {
      return this.props.history.push(nextLoc);
    }

    const currentDayPlus24 = moment()
      .tz(accountTimezone)
      .add(1, 'day')
      .toISOString();

    if (selectedAvailability.startDate < currentDayPlus24) {
      return this.props.history.push('./patient-information');
    }

    return this.setState({
      isModal: true,
    });
  }

  /**
   * Send the user to the select waitlist's dates, after clicking on the Join Waitlist button.
   */
  joinWaitlist() {
    const { timeframe } = parse(this.props.location.search);
    this.props.hideButton();
    this.props.setConfirmAvailability(false);
    this.props.setSelectedAvailability(null);
    this.props.setTimeFrame(timeframe);
    this.props.setSelectedStartDate(new Date());
    return this.props.history.push('./waitlist/select-dates');
  }

  scrollTo(name) {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 150,
      smooth: 'easeInOutQuart',
      containerId: 'scrollableContainer',
      offset: 160,
    });
  }

  render() {
    const {
      accountTimezone,
      availabilities,
      nextAvailability,
      selectedAvailability,
      selectedStartDate,
      isFetching,
      history,
      location,
    } = this.props;

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
     * Renders a single slot of time.
     *
     * @param {object} availability
     * @param {string} j
     */
    const renderTimesOnTimeFrame = timeframe => (availability) => {
      const availabilityClasses = classNames(styles.slot, {
        [styles.selectedSlot]:
          selectedAvailability && selectedAvailability.startDate === availability.startDate,
      });
      return (
        <div className={styles.cardWrapper} key={`${availability.startDate}`}>
          <Button
            onClick={() => {
              history.replace({
                location,
                search: stringify({
                  timeframe,
                }),
              });
              this.props.setTimeFrame(timeframe);
              this.selectAvailability(availability);
            }}
            className={availabilityClasses}
          >
            {genericMoment(availability.startDate, accountTimezone).format('LT')}
          </Button>
        </div>
      );
    };

    /**
     * Render the availabilities, if there is none options on the current selected date
     * it will render the next availability to the specified criteria.
     * @returns {*}
     */
    const availabilitiesDisplay = () => {
      if (availabilities.total === 0 && nextAvailability && !isFetching) {
        return nextAvailabilityButton(nextAvailability);
      }
      return (
        selectedStartDate &&
        !isFetching && (
          <div className={styles.cardsWrapper}>
            {availabilities.morning.length > 0 && (
              <Element className={styles.timeFrameWrapper} name="morning">
                <span className={styles.slotsTitle}>Morning</span>
                {availabilities.morning.map(renderTimesOnTimeFrame('morning'))}
              </Element>
            )}
            {availabilities.afternoon.length > 0 && (
              <Element className={styles.timeFrameWrapper} name="afternoon">
                <span className={styles.slotsTitle}>Afternoon</span>
                {availabilities.afternoon.map(renderTimesOnTimeFrame('afternoon'))}
              </Element>
            )}
            {availabilities.evening.length > 0 && (
              <Element className={styles.timeFrameWrapper} name="evening">
                <span className={styles.slotsTitle}>Evening</span>
                {availabilities.evening.map(renderTimesOnTimeFrame('evening'))}
              </Element>
            )}
          </div>
        )
      );
    };

    return (
      <Element
        id="scrollableContainer"
        className={styles.scrollableContainer}
        ref={(node) => {
          this.availabilitiesNode = node;
          return this.availabilitiesNode;
        }}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Date and Time</h1>
            <p className={styles.description}>
              or{' '}
              <Link className={styles.subCardLink} to="./waitlist/select-dates">
                Join Waitlist
              </Link>
            </p>
          </div>
        </div>
        <Element name="contentWrapperToScroll" className={styles.contentWrapper}>
          <div className={styles.rowCard}>
            <div className={styles.container}>
              <DayPicker
                noTarget
                disabledDays={{
                  before: new Date(),
                }}
                modifiers={{
                  disabled: {
                    before: new Date(),
                  },
                }}
                numberOfMonths={isResponsive() ? 1 : 2}
                value={selectedStartDate}
                tipSize={0.01}
                showPreviousMonth={false}
                theme={dayPickerStyles}
                onChange={this.changeSelectedDate}
              />
            </div>
          </div>
          <div className={styles.availabilitiesWrapper}>
            <CSSTransition
              timeout={{
                enter: 3000,
                exit: 1000,
              }}
              in={isFetching}
              classNames={transitions}
              onExiting={() => this.scrollTo('contentWrapperToScroll')}
            >
              <div className={styles.spinnerWrapper} key="fetching">
                <h3>
                  Checking availabilities
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </h3>
              </div>
            </CSSTransition>
            {availabilitiesDisplay()}
          </div>
        </Element>
        {this.state.isModal && <Join toCloseModal={this.handleClosingModal} history={history} />}
      </Element>
    );
  }
}

function mapStateToProps({ availabilities, widgetNavigation }) {
  const selectedStartDate = availabilities.get('selectedStartDate');
  const accountTimezone = availabilities.get('account').get('timezone');
  const isFetching = availabilities.get('isFetching');
  const availabilitiesSorted = selectedStartDate
    ? getSortedAvailabilities(
      selectedStartDate,
      availabilities.get('availabilities'),
      accountTimezone,
    )
    : {};
  return {
    accountTimezone,
    availabilities: availabilitiesSorted,
    isFetching,
    nextAvailability: availabilities.get('nextAvailability'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedStartDate,
    timeframe: availabilities.get('timeframe'),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchAvailabilities,
      setConfirmAvailability,
      hideButton,
      setIsClicked,
      showButton,
      setSelectedAvailability,
      setSelectedStartDate,
      setTimeFrame,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTime);

DateTime.propTypes = {
  accountTimezone: PropTypes.string.isRequired,
  availabilities: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.object]),
  fetchAvailabilities: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  nextAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  selectedAvailability: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(availabilityShape)]),
  selectedStartDate: PropTypes.string,
  setConfirmAvailability: PropTypes.func.isRequired,
  setSelectedAvailability: PropTypes.func.isRequired,
  setSelectedStartDate: PropTypes.func.isRequired,
  setTimeFrame: PropTypes.func.isRequired,
  timeframe: PropTypes.string,
  hideButton: PropTypes.func.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
};

DateTime.defaultProps = {
  availabilities: [],
  nextAvailability: '',
  selectedAvailability: '',
  selectedStartDate: '',
  timeframe: '',
};
