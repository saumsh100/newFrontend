
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { setWaitlistDates } from '../../../../../reducers/availabilities';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../../reducers/widgetNavigation';
import { capitalizeFirstLetter } from '../../../../Utils';
import Button from '../../../../library/Button';
import sort from '../../../../../../iso/helpers/sort/sort';
import styles from './styles.scss';

/**
 * Next default route for this component
 */
const nextRoute = './select-times';

/**
 * Checks if there are a specific route to go onclicking a card or just the default one.
 */
const contextualUrl = location => (location.state && location.state.nextRoute) || nextRoute;

const daysOfTheWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

class SelectDates extends PureComponent {
  constructor() {
    super();
    this.shouldShowNextButton = this.shouldShowNextButton.bind(this);
    this.handleAvailableDays = this.handleAvailableDays.bind(this);
  }

  componentDidMount() {
    const {
      waitlist: { dates },
      ...props
    } = this.props;

    props.setText('Select times available');
    this.shouldShowNextButton(dates.length > 0);
  }

  componentDidUpdate(prevProps) {
    const {
      floatingButtonIsClicked,
      history,
      location,
      waitlist: { times },
      ...props
    } = this.props;

    if (floatingButtonIsClicked && !prevProps.floatingButtonIsClicked) {
      props.setIsClicked(false);
      props.hideButton();
      props.setText();
      history.push({
        ...location,
        pathname: times.length > 0 ? contextualUrl(this.props.location) : nextRoute,
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
    const {
      waitlist: { dates },
      setWaitlist,
    } = this.props;
    const finalDates = [
      ...(dates.includes(day) ? dates.filter(d => d !== day) : [...dates, day]),
    ].sort((a, b) => sort()(daysOfTheWeek.indexOf(a), daysOfTheWeek.indexOf(b)));
    this.shouldShowNextButton(finalDates.length > 0);
    return setWaitlist(finalDates);
  }

  render() {
    const { waitlist: { dates } } = this.props;

    const checkIfIncludesDay = day => dates.includes(day);

    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Waitlist Days Available</h1>
            <p className={styles.description}>Select all that apply</p>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <div className={styles.timeFrameWrapper}>
              {daysOfTheWeek.map((day) => {
                const classes = classnames(styles.slot, styles.timeFrameButton, { [styles.selectedSlot]: checkIfIncludesDay(day) });
                return (
                  <div className={styles.slotWrapper} key={day}>
                    <Button onClick={() => this.handleAvailableDays(day)} className={classes}>
                      {capitalizeFirstLetter(day)}
                    </Button>
                  </div>
                );
              })}
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
      setWaitlist: setWaitlistDates,
      hideButton,
      setText,
      setIsClicked,
      showButton,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectDates);

SelectDates.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  timezone: PropTypes.string.isRequired,
  setWaitlist: PropTypes.func.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
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
SelectDates.defaultProps = {
  waitlist: {
    dates: [],
    unavailableDates: [],
    times: [],
  },
  selectedAvailability: false,
};
