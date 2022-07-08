import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Set } from 'immutable';
import { getFormattedDate } from '../../../../library';
import { Button } from '../../../components';
import Service from '../../../../../entities/models/Service';
import { setWaitSpotTimes } from '../../../../../reducers/availabilities';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import { patientUserShape } from '../../../../library/PropTypeShapes';
import officeHoursShape from '../../../../library/PropTypeShapes/officeHoursShape';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../../reducers/widgetNavigation';
import { availabilitiesGroupedByPeriod } from '../../Review/helpers';
import styles from './styles.scss';

/**
 * Checks if there are a specific route to go onclicking a card or just the default one.
 */
const contextualUrl = (location) =>
  (location.state && location.state.nextRoute) || '../patient-information';

class SelectTimes extends React.PureComponent {
  constructor(props) {
    super(props);

    this.shouldShowNextButton = this.shouldShowNextButton.bind(this);
  }

  componentDidMount() {
    this.props.setText();
    this.shouldShowNextButton(this.props.waitSpotTimes.size > 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.props.hideButton();
      this.props.setText();
      this.props.history.push(
        this.props.patientUser ? '../review' : contextualUrl(this.props.location),
      );
    }
  }

  shouldShowNextButton(should) {
    if (should) {
      this.props.showButton();
    } else {
      this.props.hideButton();
    }
  }

  render() {
    const { selectedService, officeHoursMap, waitSpotTimes, timezone } = this.props;
    const officeHours = officeHoursMap.toJS();
    /**
     * Add the current.startDate to the accumulator.
     *
     * @param {array} acc
     * @param {object} current
     */
    const reduceStartTime = (acc, current) => [...acc, current.startDate];

    /**
     * Check if the passed startDate is included on the already selected waitlist times.
     *
     * @param {object} startDate
     */
    const checkIfIncludesTime = ({ startDate }) => waitSpotTimes.includes(startDate);

    const availabilities =
      selectedService &&
      availabilitiesGroupedByPeriod(
        Object.values(officeHours),
        timezone,
        selectedService.get('duration'),
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
          availabilities.total === waitSpotTimes.size,
      });
      return (
        <div className={styles.slotWrapper} key={`${label}`}>
          <Button className={classes} onClick={() => handleSelectFrameAvailability(frame)}>
            {label}
          </Button>
        </div>
      );
    };

    const selectAllStartingTimes = {
      morning: availabilities.morning.reduce(reduceStartTime, []),
      afternoon: availabilities.afternoon.reduce(reduceStartTime, []),
      evening: availabilities.evening.reduce(reduceStartTime, []),
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
      if (frame === 'all') {
        const frameAll =
          availabilities.total === waitSpotTimes.size
            ? waitSpotTimes.clear()
            : waitSpotTimes.union(...Object.values(selectAllStartingTimes));
        this.shouldShowNextButton(frameAll.size > 0);
        return this.props.setWaitSpotTimes(frameAll);
      }
      const selectAllStartingTime = selectAllStartingTimes[frame];
      const selectedAvailabilities = selectAllStartingTime.every((v) => waitSpotTimes.includes(v))
        ? waitSpotTimes.subtract(selectAllStartingTime)
        : waitSpotTimes.union(selectAllStartingTime);
      this.shouldShowNextButton(selectedAvailabilities.size > 0);
      return this.props.setWaitSpotTimes(selectedAvailabilities);
    };

    /**
     * Check if a specific availability is already selected,
     * if it is unselected it, otherwise select it.
     *
     * @param {string} availability
     */
    const handleAvailability = ({ startDate }) => {
      const times = waitSpotTimes.includes(startDate)
        ? waitSpotTimes.remove(startDate)
        : waitSpotTimes.add(startDate);
      this.shouldShowNextButton(times.size > 0);
      return this.props.setWaitSpotTimes(times);
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
        <div className={styles.timeFrameWrapper}>
          <h3 className={styles.slotsTitle}>{label}</h3>
          {timeframe.map((availability) => {
            const classes = classnames({
              [styles.slot]: true,
              [styles.selectedSlot]: checkIfIncludesTime(availability),
            });
            return (
              <div className={styles.cardWrapper} key={`${availability.startDate}`}>
                <Button
                  key={`${availability.startDate}`}
                  data-value={`${availability.startDate}`}
                  onClick={() => handleAvailability(availability)}
                  className={classes}
                >
                  {getFormattedDate(availability.startDate, 'LT', timezone)}
                </Button>
              </div>
            );
          })}
        </div>
      );
    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Available Times</h1>
            <p className={styles.description}>Select all that apply</p>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <div className={styles.timeFrameWrapper}>
              {timeFrameButton('all', 'All Day')}
              {availabilities.morning.length > 0 && timeFrameButton('morning', 'Morning')}
              {availabilities.afternoon.length > 0 && timeFrameButton('afternoon', 'Afternoon')}
              {availabilities.evening.length > 0 && timeFrameButton('evening', 'Evening')}
            </div>
            <div className={styles.contentWrapper}>
              <span className={styles.helper}>Or</span>
              {timeListOnFrame(availabilities.morning, 'Morning')}
              {timeListOnFrame(availabilities.afternoon, 'Afternoon')}
              {timeListOnFrame(availabilities.evening, 'Evening')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ availabilities, auth, entities, widgetNavigation }) {
  const getPatientUser =
    availabilities.get('familyPatientUser') && auth.get('familyPatients').length > 0
      ? auth
          .get('familyPatients')
          .find((patient) => patient.id === availabilities.get('familyPatientUser'))
      : false;

  return {
    timezone: availabilities.get('account').get('timezone'),
    waitSpotTimes: availabilities.get('waitSpot').get('times'),
    officeHoursMap: availabilities.get('officeHours'),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
    patientUser: getPatientUser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWaitSpotTimes,
      showButton,
      hideButton,
      setIsClicked,
      setText,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectTimes);

SelectTimes.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  officeHoursMap: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  selectedService: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Service)])
    .isRequired,
  setWaitSpotTimes: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitSpotTimes: PropTypes.instanceOf(Set).isRequired,
  hideButton: PropTypes.func.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
};

SelectTimes.defaultProps = { patientUser: false };
