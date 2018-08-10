
import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRangeOfDays } from '../../../../../../server/util/time';
import { setWaitlistDates } from '../../../../../actions/availabilities';
import { DayPickerRange, Input } from '../../../../library';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../../reducers/widgetNavigation';
import { isResponsive } from '../../../../../util/hub';
import { inputTheme } from '../../../theme';
import dayPickerStyles from '../../dayPickerStyles.scss';
import styles from './styles.scss';

/**
 * Next default route for this component
 */
const nextRoute = './select-times';

/**
 * Checks if there are a specific route to go onclicking a card or just the default one.
 */
const contextualUrl = location => (location.state && location.state.nextRoute) || nextRoute;

class SelectDates extends PureComponent {
  componentDidMount() {
    const {
      waitlist: { dates },
      ...props
    } = this.props;

    props.setText('Select times available');
    if (dates.length > 0) {
      props.showButton();
    } else {
      props.hideButton();
    }
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

  render() {
    const {
      selectedAvailability, timezone, setWaitlist, waitlist,
    } = this.props;

    /**
     * Extracts dates on a date-range and also set these date to the reducer.
     *
     * @param {*} param0
     */
    const extractRange = ({ from, to }) => {
      const dates = from && to ? getRangeOfDays(from, to, timezone) : [];
      if (dates.length > 0) {
        this.props.showButton();
      }

      return setWaitlist(dates);
    };

    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Select Waitlist Date Range</h1>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.rowCard}>
            <div className={styles.container}>
              <DayPickerRange
                fieldsWrapper={dayPickerFields}
                monthsToShow={isResponsive() ? 1 : 2}
                from={(waitlist.dates.length && moment(waitlist.dates[0]).toDate()) || ''}
                to={
                  (waitlist.dates.length &&
                    moment(waitlist.dates[waitlist.dates.length - 1]).toDate()) ||
                  ''
                }
                disabledDays={{
                  before: new Date(),
                  after:
                    (selectedAvailability && moment(selectedAvailability.startDate).toDate()) ||
                    null,
                }}
                onChange={values => extractRange(values)}
                theme={dayPickerStyles}
                modifiers={{
                  [dayPickerStyles.start]:
                    (waitlist.dates.length && moment(waitlist.dates[0]).toDate()) || '',
                  [dayPickerStyles.end]:
                    (waitlist.dates.length &&
                      moment(waitlist.dates[waitlist.dates.length - 1]).toDate()) ||
                    '',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const dayPickerFields = ({
  from: {
    fromReadOnly, fromValue, fromRef, fromOnClick,
  },
  to: {
    toReadOnly, toValue, toRef, toOnClick,
  },
}) => (
  <div className={styles.rangeInputContainer}>
    <Input
      readOnly={fromReadOnly}
      refCallBack={fromRef}
      value={fromValue}
      onClick={fromOnClick}
      label="Start Date"
      theme={inputTheme(styles)}
    />
    <Input
      readOnly={toReadOnly}
      refCallBack={toRef}
      value={toValue}
      onClick={toOnClick}
      label="End Date"
      theme={inputTheme(styles)}
    />
  </div>
);

dayPickerFields.propTypes = {
  from: PropTypes.shape({
    fromReadOnly: PropTypes.bool,
    fromValue: PropTypes.string,
    fromRef: PropTypes.func,
    fromOnClick: PropTypes.func,
  }).isRequired,
  to: PropTypes.shape({
    toReadOnly: PropTypes.bool,
    toValue: PropTypes.string,
    toRef: PropTypes.func,
    toOnClick: PropTypes.func,
  }).isRequired,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(SelectDates);

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
  waitlist: { dates: [], unavailableDates: [], times: [] },
  selectedAvailability: false,
};
