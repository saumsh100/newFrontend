
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import classnames from 'classnames';
import { week, frames, dayToFrame, capitalize } from '../../../../../util/isomorphic';
import {
  updateDaysOfTheWeek,
  getSelectedDaysOfTheWeek,
} from '../../../../../reducers/availabilities';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../../reducers/widgetNavigation';
import Button from '../../../../library/Button';
import styles from './styles.scss';

/**
 * Next default route for this component
 */
const nextRoute = './select-times';

const isFullFrame = (frame, waitSpot) =>
  week[frame].reduce((acc, v) => (!waitSpot.getIn(['daysOfTheWeek', v]) ? false : acc), true);

class SelectDates extends PureComponent {
  constructor(props) {
    super(props);

    const { waitSpot } = props;

    this.state = {
      [frames.all]: getSelectedDaysOfTheWeek(waitSpot).size === 7,
      [frames.weekdays]: isFullFrame(frames.weekdays, waitSpot),
      [frames.weekends]: isFullFrame(frames.weekends, waitSpot),
    };

    this.shouldShowNextButton = this.shouldShowNextButton.bind(this);
    this.handleAvailableDays = this.handleAvailableDays.bind(this);
    this.handleSelectFrameAvailability = this.handleSelectFrameAvailability.bind(this);
  }

  componentDidMount() {
    const { waitSpot, ...props } = this.props;

    props.setText();
    this.shouldShowNextButton(getSelectedDaysOfTheWeek(waitSpot).size > 0);
  }

  componentDidUpdate(prevProps) {
    const { floatingButtonIsClicked, history, location, ...props } = this.props;

    if (floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      props.setIsClicked(false);
      props.hideButton();
      props.setText();
      history.push({
        ...location,
        pathname: nextRoute,
      });
    }
  }

  shouldShowNextButton(should) {
    return should ? this.props.showButton() : this.props.hideButton();
  }

  /**
   * Extracts dates on a date-range and also set these date to the reducer.
   *
   * @param day
   */
  handleAvailableDays(day) {
    const { waitSpot } = this.props;

    const finalWaitSpot = waitSpot.updateIn(['daysOfTheWeek', day], d => !d);

    const selectedDays = getSelectedDaysOfTheWeek(finalWaitSpot);

    if (selectedDays.size === 7) {
      return this.handleSelectFrameAvailability(frames.all);
    }

    const update = isFullFrame(dayToFrame(day), finalWaitSpot);

    this.setState({
      [frames.all]: false,
      [dayToFrame(day)]: update,
    });
    this.shouldShowNextButton(selectedDays.size > 0);

    return this.props.updateDaysOfTheWeek(finalWaitSpot.get('daysOfTheWeek'));
  }

  handleSelectFrameAvailability(frame) {
    const { waitSpot } = this.props;

    const selectedDays = getSelectedDaysOfTheWeek(waitSpot);

    this.setState(
      prevState =>
        (frame === frames.all
          ? {
            [frames.all]: !prevState.all,
            [frames.weekdays]: !prevState.all,
            [frames.weekends]: !prevState.all,
          }
          : {
            [frames.all]: selectedDays.size + week[frame].length === 7,
            [frames[frame]]: !prevState[frame],
          }),
      () => {
        const finalWaitSpot = waitSpot.withMutations((w) => {
          week[frame].forEach((key) => {
            w.setIn(['daysOfTheWeek', key], this.state[frame]);
          });
        });

        this.shouldShowNextButton(getSelectedDaysOfTheWeek(finalWaitSpot).size > 0);

        return this.props.updateDaysOfTheWeek(finalWaitSpot.get('daysOfTheWeek'));
      },
    );
  }

  render() {
    const { waitSpot } = this.props;

    /**
     * Return a button scoped to a specific time-frame
     *
     * @param {string} frame
     * @param {string} label
     */
    const timeFrameButton = (frame, label) => {
      const classes = classnames({
        [styles.slot]: true,
        [styles.timeFrameButton]: true,
        [styles.selectedSlot]: this.state[frame],
      });
      return (
        <div className={styles.slotWrapper} key={`${label}`}>
          <Button className={classes} onClick={() => this.handleSelectFrameAvailability(frame)}>
            {label}
          </Button>
        </div>
      );
    };

    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Available Days</h1>
            <p className={styles.description}>Select all that apply</p>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <div className={styles.timeFrameWrapper}>
              {timeFrameButton(frames.all, 'All Days')}
              {timeFrameButton(frames.weekdays, 'Weekdays')}
              {timeFrameButton(frames.weekends, 'Weekends')}
            </div>
            <div className={styles.contentWrapper}>
              <span className={styles.helper}>Or</span>
              <div className={styles.timeFrameWrapper}>
                {week[frames.all].map((day) => {
                  const { slot, selectedSlot } = styles;
                  return (
                    <div className={styles.cardWrapper} key={day}>
                      <Button
                        onClick={() => this.handleAvailableDays(day)}
                        className={classnames({
                          [slot]: true,
                          [styles.timeFrameButton]: true,
                          [selectedSlot]: waitSpot.getIn(['daysOfTheWeek', day]),
                        })}
                      >
                        {capitalize(day)}
                      </Button>
                    </div>
                  );
                })}
              </div>
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
    waitSpot: availabilities.get('waitSpot'),
    selectedAvailability:
      availabilities.get('confirmedAvailability') && availabilities.get('selectedAvailability'),
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
      updateDaysOfTheWeek,
      hideButton,
      setText,
      setIsClicked,
      showButton,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectDates);

SelectDates.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  timezone: PropTypes.string.isRequired,
  updateDaysOfTheWeek: PropTypes.func.isRequired,
  waitSpot: PropTypes.instanceOf(Map).isRequired,
  selectedAvailability: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      endDate: PropTypes.string,
      practitionerId: PropTypes.string,
      startDate: PropTypes.string,
    }),
  ]),
  hideButton: PropTypes.func.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
};
SelectDates.defaultProps = { selectedAvailability: false };
