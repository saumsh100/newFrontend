
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import createAvailabilitiesFromOpening from '../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import { Button } from '../../../library';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { setIsBooking } from '../../../../actions/availabilities';
import { createRequest, createWaitSpot } from '../../../../thunks/availabilities';
import { officeHoursShape } from '../../../library/PropTypeShapes/officeHoursShape';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import dateFormatter from '../../../../../iso/helpers/dateTimezone/dateFormatter';
import { SummaryItemFactory } from './SummaryItem';
import { handleAvailabilitiesTimes } from './helpers';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../reducers/widgetNavigation';
import styles from './styles.scss';

const NOT_PROVIDED_TEXT = 'Not Provided';

/**
 * Display the dates selected on the waitlist's steps.
 * If is a regular range display the first and the last day,
 * otherwise display a list of dates.
 */
const waitlistDates = (dates, timezone) => {
  if (dates.length === 0) {
    return null;
  }
  const firstDate = dateFormatter(dates[0], timezone, 'MMM Do');
  const lastDate = dateFormatter(dates[dates.length - 1], timezone, 'MMM Do');
  /**
   * It shows the days that are on the waitlist.
   */
  return `From: ${firstDate} - To: ${lastDate}`;
};

const compareTimes = earlier => (value, ref) => (value && earlier ? value < ref : value > ref);
const isValueEarlier = compareTimes(true);
const isValueLater = compareTimes(false);

const getOfficeHours = (key, comparison) => (acc, curr) => {
  if (!acc || (acc && curr && comparison(curr[key], acc))) {
    acc = curr[key];
  }
  return acc;
};

class Review extends PureComponent {
  constructor(props) {
    super(props);

    this.submitRequest = this.submitRequest.bind(this);
  }

  componentDidMount() {
    const { dateAndTime, hasWaitList, canConfirm } = this.props;
    this.props.setText('Confirm Booking');
    if (canConfirm && (dateAndTime || hasWaitList)) {
      this.props.showButton();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.floatingButtonIsClicked && this.props.floatingButtonIsClicked) {
      this.props.setIsClicked(false);
      this.props.hideButton();
      this.props.setText();
      return this.submitRequest();
    }

    return undefined;
  }

  /**
   * Manages if we should create a waitlist and an availability or both
   */
  submitRequest() {
    const {
      dateAndTime, hasWaitList, history, ...props
    } = this.props;

    const creationPromises = [
      ...(dateAndTime ? [props.createRequest()] : []),
      ...(hasWaitList ? [props.createWaitSpot()] : []),
    ];
    return Promise.all(creationPromises)
      .then(() => history.push('./complete'))
      .catch(err => console.error('Creating request failed', err));
  }

  render() {
    const {
      dateAndTime,
      history,
      isBooking,
      location,
      notes,
      officeHours,
      patientUser,
      selectedPractitioner,
      selectedService,
      timezone,
      waitlist,
      ...props
    } = this.props;

    const b = path =>
      location.pathname
        .split('/')
        .filter((v, index) => index < 5)
        .concat(path)
        .join('/');

    const officeHoursValues = Object.values(officeHours);
    /**
     * Look over the officeHours object and find the earliest startTime of the clinic.
     */
    const earliestStartTime = officeHoursValues.reduce(getOfficeHours('startTime', isValueEarlier));

    /**
     * Look over the officeHours object and find the latest endTime of the clinic.
     */
    const latestEndTime = officeHoursValues.reduce(getOfficeHours('endTime', isValueLater));

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
     * Display a linear list of times that were selected from the user on the waitlist's steps.
     */
    const waitlistTimes = () =>
      waitlist.times.length > 0 && (
        <span>
          {Object.keys(availabilities)
            .reduce(handleAvailabilitiesTimes(waitlist.times, availabilities, timezone), [])
            .map(text => text)}
        </span>
      );

    /**
     * Returns the component that renders the title, value and edit button for the provided data.
     */
    const SummaryItem = SummaryItemFactory({
      location,
      history,
    });

    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>
              {location.state && location.state.isReviewRoute ? 'Almost Done' : 'Booking Summary'}
            </h1>
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>Waitlist Summary</h3>
            {waitlist.dates.length > 0 ? (
              <div>
                <p className={styles.subtitle}>
                  Here are the informations that you already defined to your appointment.
                </p>
                <SummaryItem
                  label="Reason"
                  value={selectedService.get('name')}
                  link={b('reason')}
                />
                <SummaryItem
                  label="Available Dates"
                  value={waitlistDates(waitlist.dates, timezone)}
                  link={b('waitlist/select-dates')}
                />
                <SummaryItem
                  label="Times"
                  value={waitlistTimes()}
                  link={b('waitlist/select-times')}
                />
              </div>
            ) : (
              <div className={styles.joinWaitlist}>
                <div className={styles.subCardWrapper}>
                  <p className={styles.subCardSubtitle}>Looks like you did not set any waitlist</p>
                </div>
                <Button
                  className={styles.subCardLink}
                  onClick={() => {
                    if (!isBooking) {
                      props.setIsBooking(true);
                    }
                    history.push(b('waitlist/select-dates'));
                  }}
                >
                  Join Waitlist
                </Button>
              </div>
            )}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>Appointment Summary</h3>
            <p className={styles.subtitle}>
              Here are the informations that you already defined to your appointment.
            </p>
            {selectedService.get('name') && (
              <SummaryItem label="Reason" value={selectedService.get('name')} link={b('reason')} />
            )}
            <SummaryItem
              label="Practitioner"
              value={
                (selectedPractitioner && selectedPractitioner.getPrettyName()) || 'No Preference'
              }
              link={b('practitioner')}
            />

            {dateAndTime && (
              <SummaryItem
                label="Date and Time"
                value={`${dateFormatter(
                  dateAndTime.startDate,
                  timezone,
                  'ddd, MMM Do',
                )} at ${dateFormatter(dateAndTime.startDate, timezone, 'h:mm a')}`}
                link={b('date-and-time')}
              />
            )}
            {patientUser && (
              <SummaryItem
                label="Patient"
                value={`${patientUser.firstName} ${patientUser.lastName}`}
                link="./patient-information"
              />
            )}
            {patientUser && (
              <SummaryItem
                label="Insurance Carrier"
                value={`${patientUser.insuranceCarrier || NOT_PROVIDED_TEXT}`}
                link={b('patient-information')}
              />
            )}
            {patientUser && (
              <SummaryItem
                label="Insurance Member ID & Group ID"
                value={`${patientUser.insuranceMemberId ||
                  NOT_PROVIDED_TEXT} - ${patientUser.insuranceGroupId || NOT_PROVIDED_TEXT}`}
                link={b('patient-information')}
              />
            )}

            {patientUser && (
              <SummaryItem
                label="Notes"
                value={`${notes || NOT_PROVIDED_TEXT}`}
                link={b('additional-information')}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({
  availabilities, entities, auth, widgetNavigation,
}) {
  const getPatientUser =
    availabilities.get('familyPatientUser') && auth.get('familyPatients').length > 0
      ? auth
        .get('familyPatients')
        .find(patient => patient.id === availabilities.get('familyPatientUser'))
      : false;
  return {
    dateAndTime: availabilities.get('selectedAvailability'),
    hasWaitList: availabilities.get('waitlist').get('dates').length > 0,
    isAuth: auth.get('isAuthenticated'),
    isBooking: availabilities.get('isBooking'),
    notes: availabilities.get('notes'),
    officeHours: availabilities.get('officeHours').toJS(),
    confirmedAvailability: availabilities.get('confirmedAvailability'),
    patientUser: getPatientUser,
    selectedPractitioner: entities.getIn([
      'practitioners',
      'models',
      availabilities.get('selectedPractitionerId'),
    ]),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    timezone: availabilities.get('account').get('timezone'),
    user: auth.get('patientUser'),
    waitlist: availabilities.get('waitlist').toJS(),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createRequest,
      createWaitSpot,
      setIsBooking,
      hideButton,
      setIsClicked,
      setText,
      showButton,
    },
    dispatch,
  );
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review));

Review.propTypes = {
  canConfirm: PropTypes.bool,
  confirmedAvailability: PropTypes.bool.isRequired,
  createRequest: PropTypes.func.isRequired,
  createWaitSpot: PropTypes.func.isRequired,
  dateAndTime: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    practitionerId: PropTypes.string,
  }),
  hasWaitList: PropTypes.bool.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isBooking: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  notes: PropTypes.string,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  selectedPractitioner: PropTypes.oneOfType([PropTypes.instanceOf(Practitioner), PropTypes.string]),
  selectedService: PropTypes.oneOfType([PropTypes.instanceOf(Service), PropTypes.string]),
  setIsBooking: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    unavailableDates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  hideButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
};

Review.defaultProps = {
  canConfirm: true,
  dateAndTime: {
    startDate: '',
    endDate: '',
    practitionerId: '',
  },
  notes: '',
  patientUser: null,
  selectedPractitioner: '',
  selectedService: '',
  waitlist: {
    dates: [],
    unavailableDates: [],
    times: [],
  },
};
