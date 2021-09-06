
import React, { PureComponent } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CSSTransition } from 'react-transition-group';
import { Element, scroller } from 'react-scroll';
import { stringify, parse } from 'query-string';
import { groupTimesPerPeriod } from '../../../library/util/datetime/helpers';
import {
  setConfirmAvailability,
  setSelectedAvailability,
  setSelectedStartDate,
  setTimeFrame,
} from '../../../../reducers/availabilities';
import Button from '../../../library/Button';
import DayPicker from '../../../library/DayPicker';
import Join from '../Waitlist/Join';
import { fetchAvailabilities } from '../../../../thunks/availabilities';
import {
  showButton,
  hideButton,
  setText,
  setIsClicked,
} from '../../../../reducers/widgetNavigation';
import availabilityShape from '../../../library/PropTypeShapes/availabilityShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import { isResponsive } from '../../../../util/hub';
import transitions from './transitions.scss';
import dayPickerStyles from '../dayPickerStyles.scss';
import styles from './styles.scss';
import { getFormattedDate, getTodaysDate, getUTCDate, parseDate } from '../../../library';

/**
 * Loop a list of date object and
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
    .filter(date => getUTCDate(date.startDate, accountTimezone).isSame(selectedDate, 'day'))
    .reduce(groupTimesPerPeriod(accountTimezone), {
      morning: [],
      afternoon: [],
      evening: [],
      total: 0,
    });

class DateTime extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
      month: new Date(),
      needToUpdateWaitlist: false,
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

    this.props.setText();

    if (finalTimeFrame && finalTimeFrame !== '') {
      this.scrollTo(finalTimeFrame);
    }
    // This can be removed when the new booking widget is released
    if (
      !this.props.nextAvailability
      && this.props.availabilities.total === 0
      && !this.props.dueDate
    ) {
      this.props.setSelectedStartDate('');
    }

    if (
      this.props.selectedAvailability !== null
      && !!this.props.availabilities.total
      && !!this.props.selectedAvailability
    ) {
      this.props.showButton();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dueDate !== this.props.dueDate) {
      this.props.fetchAvailabilities();
    }
    if (this.props.floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.confirmDateTime();
    }
  }

  /**
   * If the provided date is different than the actual selectedStartDate,
   * set the new date.
   *
   * @param date
   * @param nextAvailability
   */
  changeSelectedDate(date, nextAvailability = false) {
    this.setState(prevState => ({
      needToUpdateWaitlist: true,
      month: nextAvailability
        ? parseDate(date, this.props.accountTimezone).toDate()
        : prevState.month,
    }));
    this.props.hideButton();
    this.props.setSelectedAvailability(null);
    this.props.setSelectedStartDate(date);
    this.props.fetchAvailabilities();
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
    const { selectedAvailability, accountTimezone, location, history } = this.props;

    this.props.setConfirmAvailability(true);

    const nextLoc = location.state && location.state.nextRoute;
    if (nextLoc && !this.state.needToUpdateWaitlist) {
      this.props.hideButton();
      return history.push(nextLoc);
    }

    const currentDayPlus24 = getTodaysDate(accountTimezone)
      .add(1, 'day')
      .toISOString();

    if (selectedAvailability.startDate < currentDayPlus24) {
      this.props.hideButton();
      return history.push(nextLoc || './patient-information');
    }

    return this.setState({ isModal: true });
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
    return this.props.history.push({
      ...this.props.location,
      pathname: './waitlist/select-dates',
    });
  }

  scrollTo(name) {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 150,
      smooth: 'easeInOutQuart',
      containerId: 'widgetContainer',
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
        onClick={() => this.changeSelectedDate(getUTCDate(startDate, accountTimezone), true)}
        className={styles.nextAvailabilityButton}
      >
        Next Availablility on {getUTCDate(startDate, accountTimezone).format('ddd, MMM D')}
      </Button>
    );

    /**
     * Renders a single slot of time.
     *
     * @param timeframe
     * @return React.element
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
                ...location,
                search: stringify({
                  ...parse(location.search),
                  timeframe,
                }),
              });
              this.props.setTimeFrame(timeframe);
              this.selectAvailability(availability);
            }}
            className={availabilityClasses}
          >
            {getFormattedDate(availability.startDate, 'LT', accountTimezone)}
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
      if (availabilities.total === 0 && !isFetching) {
        if (nextAvailability) {
          return nextAvailabilityButton(nextAvailability);
        }
        return (
          <div className={styles.regularText}>
            <h3>There is no availability</h3>
          </div>
        );
      }
      return (
        selectedStartDate
        && !isFetching && (
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
    const currentDate = getTodaysDate(accountTimezone).toDate();
    const queryVars = parse(this.props.location.search);
    const disabledDates = queryVars
      && queryVars.dueDate
      && this.props.isRecall
      && queryVars.dueDate > currentDate.toISOString()
      ? getUTCDate(queryVars.dueDate, accountTimezone).toDate()
      : currentDate;
    return (
      <Element id="scrollableContainer" className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Date and Time</h1>
          </div>
        </div>
        <Element name="contentWrapperToScroll" className={styles.contentWrapper}>
          <div className={styles.rowCard}>
            <div className={styles.container}>
              <DayPicker
                noTarget
                fromMonth={new Date()}
                month={this.state.month}
                disabledDays={{ before: disabledDates }}
                modifiers={{ disabled: { before: disabledDates } }}
                numberOfMonths={isResponsive() ? 1 : 2}
                // here i'm formatting the date like so we don't convert the date
                // selectedStartDate needs to be iso string because of the API needs it
                // but it can sometimes be a future date depending on the timezone you currently are
                value={
                  selectedStartDate
                  && getFormattedDate(selectedStartDate, 'YYYY-MM-DD', accountTimezone)
                }
                tipSize={0.01}
                showPreviousMonth={false}
                theme={dayPickerStyles}
                onChange={this.changeSelectedDate}
                timezone={accountTimezone}
              />
            </div>
          </div>
          <div className={styles.availabilitiesWrapper}>
            <CSSTransition
              in={isFetching}
              classNames={transitions}
              timeout={15000}
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
        {this.state.isModal && (
          <Join toCloseModal={this.handleClosingModal} history={history} location={location} />
        )}
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
    isRecall: availabilities.get('isRecall'),
    dueDate: availabilities.get('dueDate'),
    nextAvailability: availabilities.get('nextAvailability'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedStartDate,
    timeframe: availabilities.get('timeframe'),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
    waitListDates: availabilities.getIn(['waitlist', 'dates']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchAvailabilities,
      setConfirmAvailability,
      hideButton,
      setIsClicked,
      setText,
      showButton,
      setSelectedAvailability,
      setSelectedStartDate,
      setTimeFrame,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTime);

DateTime.propTypes = {
  accountTimezone: PropTypes.string.isRequired,
  availabilities: PropTypes.oneOfType([PropTypes.instanceOf(List), PropTypes.object]),
  dueDate: PropTypes.string,
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
  isRecall: PropTypes.bool.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
};

DateTime.defaultProps = {
  dueDate: null,
  availabilities: [],
  nextAvailability: '',
  selectedAvailability: '',
  selectedStartDate: '',
  timeframe: '',
};
