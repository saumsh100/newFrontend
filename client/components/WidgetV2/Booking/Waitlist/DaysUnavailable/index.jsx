
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import difference from 'lodash/difference';
import { List } from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Button, DayPickerRange } from '../../../../library';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import { setWaitlistUnavailableDates } from '../../../../../actions/availabilities';
import patientUserShape from '../../../../library/PropTypeShapes/patientUserShape';
import { isResponsive } from '../../../../../util/hub';
import styles from './styles.scss';
import dayPickerStyles from '../../dayPickerStyles.scss';

function DaysUnavailable({
  history,
  isAuth,
  location,
  patientUser,
  setUnavailableDates,
  waitlistDates,
  waitlistUnavailableDates,
}) {
  /**
   * This gets a date and format it to check if it's present on the
   * waitlist's available dates, if so checks if it's on the unavailableDates list.
   * If is not we add this date as an unavailable day,
   * otherwise we add it back as an available day.
   *
   * @param {string} clickedDay
   */
  const toggleDateFromWaitlist = (clickedDay) => {
    const formatedValue = moment(clickedDay).format('YYYY-MM-DD');
    if (waitlistDates.indexOf(formatedValue) <= -1) {
      return;
    }
    const unavailableDates =
      waitlistUnavailableDates.indexOf(formatedValue) > -1
        ? waitlistUnavailableDates.filter(value => value !== formatedValue)
        : [...waitlistUnavailableDates, formatedValue];
    setUnavailableDates(unavailableDates);
  };

  /**
   * It shows the days that are on the waitlist selection and are not on the unavailableDates list.
   */
  const daysToDisplay = difference(waitlistDates, waitlistUnavailableDates).map(value =>
    moment(value).toDate());

  const handleSubmitting = () => {
    if (!isAuth || !patientUser || !patientUser.isPhoneNumberConfirmed) {
      return history.push({
        pathname: '../../login',
        state: {
          nextRoute: './book/patient-information',
        },
      });
    }
    /**
     * Checks if there are a specific route to go onclicking a card or just the default one.
     */
    const contextualUrl = (location.state && location.state.nextRoute) || '../patient-information';
    return history.push(contextualUrl);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Select Waitlist Dates Unavailable</h3>
        <p className={styles.subtitle}>
          Select all days that you are UNAVAILABLE for an earlier appointment. (Select all that
          apply)
        </p>
        <DayPickerRange
          fieldsWrapper={() => undefined}
          handleDayClick={day => toggleDateFromWaitlist(day)}
          modifiers={{
            [dayPickerStyles.selected]: daysToDisplay,
          }}
          monthsToShow={isResponsive() ? 1 : 2}
          onChange={e => e}
          disabledDays={{
            before: moment(waitlistDates[0]).toDate(),
            after: moment(waitlistDates[waitlistDates.length - 1]).toDate(),
          }}
          theme={dayPickerStyles}
        />
        <Button
          disabled={!daysToDisplay.length}
          className={styles.fullWidthButton}
          onClick={handleSubmitting}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps({ availabilities, auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
    patientUser: auth.get('patientUser'),
    waitlistDates: availabilities.get('waitlist').get('dates'),
    waitlistUnavailableDates: availabilities.get('waitlist').get('unavailableDates'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUnavailableDates: setWaitlistUnavailableDates,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DaysUnavailable);

DaysUnavailable.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
  setUnavailableDates: PropTypes.func.isRequired,
  waitlistDates: PropTypes.arrayOf(PropTypes.string),
  waitlistUnavailableDates: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.instanceOf(List),
  ]),
};

DaysUnavailable.defaultProps = {
  waitlistDates: [],
  waitlistUnavailableDates: [],
};
