
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
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import officeHoursShape from '../../../../library/PropTypeShapes/officeHoursShape';
import createAvailabilitiesFromOpening from '../../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import groupTimesPerPeriod from '../../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../../reducers/widgetNavigation';
import styles from './styles.scss';

/**
 * Checks if there are a specific route to go onclicking a card or just the default one.
 */
const contextualUrl = location =>
  (location.state && location.state.nextRoute) || '../patient-information';

class SelectTimes extends React.Component {
  constructor(props) {
    super(props);

    this.shouldShowNextButton = this.shouldShowNextButton.bind(this);
  }

  componentDidMount() {
    this.shouldShowNextButton(this.props.waitlist.times.length > 0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.props.hideButton();
      this.props.setText();
      this.props.history.push(contextualUrl(this.props.location));
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
    const {
      selectedService, officeHours, waitlist, timezone, setWaitlist,
    } = this.props;

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
    const checkIfIncludesTime = ({ startDate }) => waitlist.times.includes(startDate);

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
        <div className={styles.slotWrapper} key={`${label}`}>
          <Button className={classes} onClick={() => handleSelectFrameAvailability(frame)}>
            {label}
          </Button>
        </div>
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
      this.shouldShowNextButton(selectedAvailabilities.length > 0);
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
      this.shouldShowNextButton(times.length > 0);
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
        <div className={styles.timeFrameWrapper}>
          <h3 className={styles.slotsTitle}>{label}</h3>
          {timeframe.map((availability) => {
            const classes = classnames(styles.slot, {
              [styles.selectedSlot]: checkIfIncludesTime(availability),
            });
            return (
              <div className={styles.cardWrapper} key={`${availability.startDate}`}>
                <Button
                  key={`${availability.startDate}`}
                  onClick={() => handleAvailability(availability)}
                  className={classes}
                >
                  {moment.tz(availability.startDate, timezone).format('LT')}
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
            <h1 className={styles.heading}>Select Waitlist Times Available</h1>
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

function mapStateToProps({ availabilities, entities, widgetNavigation }) {
  return {
    timezone: availabilities.get('account').get('timezone'),
    waitlist: availabilities.get('waitlist').toJS(),
    officeHours: availabilities.get('officeHours').toJS(),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWaitlist: setWaitlistTimes,
      showButton,
      hideButton,
      setIsClicked,
      setText,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectTimes);

SelectTimes.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  selectedService: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Service)])
    .isRequired,
  setWaitlist: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    unavailableDates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
  hideButton: PropTypes.func.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
};

SelectTimes.defaultProps = {
  waitlist: {
    dates: [],
    unavailableDates: [],
    times: [],
  },
};
