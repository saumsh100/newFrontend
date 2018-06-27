
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, DayPickerRange } from '../../../../library';
import Service from '../../../../../entities/models/Service';
import styles from './styles.scss';
import { historyShape } from '../../../../library/PropTypeShapes/routerShapes';
import { setWaitlistUnavailableDates } from '../../../../../actions/availabilities';
import { patientShape } from '../../../../library/PropTypeShapes';

function DaysUnavailable({
  history,
  waitlist,
  setUnavailableDates,
  isAuth,
  patientUser,
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
    if (waitlist.dates.indexOf(formatedValue) <= -1) {
      return;
    }
    let unavailableDates = waitlist.unavailableDates;
    if (unavailableDates.indexOf(formatedValue) > -1) {
      unavailableDates = unavailableDates.filter(value => value !== formatedValue);
    } else {
      unavailableDates = [...unavailableDates, formatedValue];
    }
    setUnavailableDates(unavailableDates);
  };

  /**
   * It shows the days that are on the waitlist selection and are not on the unavailableDates list.
   */
  const daysToDisplay = difference(
    waitlist.dates,
    waitlist.unavailableDates,
  ).map(value => (value = moment(value).toDate()));

  const handleSubmitting = () => {
    let followUrl = '../patient-information';
    if (!isAuth || !patientUser || !patientUser.get('isPhoneNumberConfirmed')) {
      followUrl = {
        pathname: '../../login',
        state: {
          nextRoute: './book/patient-information',
        },
      };
    }
    return history.push(followUrl);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Select Waitlist Dates Unavailable</h3>
        <p className={styles.subtitle}>
          Select all days that you are UNAVAILABLE for an earlier appointment.
          (Select all that apply)
        </p>
        <DayPickerRange
          fieldsWrapper={() => undefined}
          handleDayClick={day => toggleDateFromWaitlist(day)}
          modifiers={{ highlighted: daysToDisplay }}
          disabledDays={{
            before: moment(waitlist.dates[0]).toDate(),
            after: moment(waitlist.dates[waitlist.dates.length - 1]).toDate(),
          }}
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

function mapStateToProps({ availabilities, entities, auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
    patientUser: auth.get('patientUser'),
    waitlist: availabilities.get('waitlist').toJS(),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DaysUnavailable);

DaysUnavailable.propTypes = {
  history: PropTypes.shape(historyShape),
  setUnavailableDates: PropTypes.func,
  isAuth: PropTypes.bool,
  patientUser: PropTypes.shape(patientShape),
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
  selectedService: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Service),
  ]),
};
