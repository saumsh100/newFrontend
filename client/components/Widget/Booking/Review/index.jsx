
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Map } from 'immutable';
import { Button, getFormattedDate } from '../../../library';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { createRequest, createWaitSpot } from '../../../../thunks/availabilities';
import officeHoursShape from '../../../library/PropTypeShapes/officeHoursShape';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import { SummaryItemFactory } from './SummaryItem';
import { availabilitiesGroupedByPeriod, waitlistDates, waitlistTimes } from './helpers';
import {
  showButton,
  hideButton,
  setIsClicked,
  setText,
} from '../../../../reducers/widgetNavigation';
import { BookingReviewSVG } from '../../SVGs';
import {
  refreshFirstStepData,
  getSelectedDaysOfTheWeek,
} from '../../../../reducers/availabilities';
import styles from './styles.scss';

const NOT_PROVIDED_TEXT = 'Not Provided';

class Review extends PureComponent {
  constructor(props) {
    super(props);

    this.submitRequest = this.submitRequest.bind(this);
  }

  componentDidMount() {
    const { dateAndTime, hasWaitList, canConfirm } = this.props;
    if (canConfirm && (dateAndTime || hasWaitList)) {
      this.props.setText('Submit Booking Request');
      return this.props.showButton();
    }
    this.props.setText();
    return this.props.hideButton();
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
    const { dateAndTime, hasWaitList, history, ...props } = this.props;

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
      hasWaitList,
      history,
      location,
      notes,
      officeHours,
      patientUser,
      selectedDaysOfTheWeek,
      selectedPractitioner,
      selectedService,
      timezone,
      waitSpot,
    } = this.props;

    const b = path =>
      location.pathname
        .split('/')
        .filter((v, index) => index < 5)
        .concat(path)
        .join('/');

    /**
     * Generates the availabilities using the office openings,
     * also group them inside the specific time-frame.
     */
    const availabilities = selectedService
      && availabilitiesGroupedByPeriod(
        Object.values(officeHours),
        timezone,
        selectedService.get('duration'),
      );

    /**
     * Returns the component that renders the title, value and edit button for the provided data.
     */
    const SummaryItem = SummaryItemFactory({
      location,
      history,
    });

    const localFormattedDate = format => getFormattedDate(dateAndTime.startDate, format, timezone);

    const dateTimeSummaryText = dateAndTime
      ? `${localFormattedDate('ddd, MMM Do')} at ${localFormattedDate('h:mm a')}`
      : NOT_PROVIDED_TEXT;

    return (
      <div className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Review & Book</h1>
          </div>
          <div className={styles.content}>
            <div className={styles.titleWrapper}>
              <h3 className={styles.title}>Appointment Summary</h3>
              <div>
                <Button
                  className={styles.editLink}
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you want to edit your appointment information? You will have to re-select the steps in Find a Time section.',
                      )
                    ) {
                      this.props.refreshFirstStepData();
                      return this.props.history.push(b('reason'), { nextRoute: location.pathname });
                    }
                    return undefined;
                  }}
                >
                  <BookingReviewSVG />
                  Edit
                </Button>
              </div>
            </div>
            {selectedService && selectedService.get('name') && (
              <SummaryItem label="Reason" value={selectedService.get('name')} link={b('reason')} />
            )}
            <SummaryItem
              label="Practitioner"
              value={
                (selectedPractitioner && selectedPractitioner.getPrettyName()) || 'No Preference'
              }
              link={b('practitioner')}
            />

            {(dateAndTime || hasWaitList) && (
              <SummaryItem
                label="Date and Time"
                value={dateTimeSummaryText}
                link={b('date-and-time')}
              />
            )}
            <hr />
            {hasWaitList ? (
              <div>
                <div className={styles.titleWrapper}>
                  <h3 className={styles.title}>Waitlist Summary</h3>
                  <div>
                    <Button
                      className={styles.editLink}
                      onClick={() =>
                        this.props.history.push(b('waitlist/select-dates'), {
                          nextRoute: location.pathname,
                        })
                      }
                    >
                      <BookingReviewSVG />
                      Edit
                    </Button>
                  </div>
                </div>
                <SummaryItem
                  label="Available Dates"
                  value={waitlistDates(selectedDaysOfTheWeek)}
                  link={b('waitlist/select-dates')}
                />
                <SummaryItem
                  label="Times"
                  value={waitlistTimes(waitSpot, availabilities, timezone)}
                  link={b('waitlist/select-times')}
                />
              </div>
            ) : (
              <div className={styles.titleWrapper}>
                <h3 className={styles.emptyWaitlistTitle}>Waitlist Summary</h3>
                <div>
                  <Button
                    className={styles.subCardLink}
                    onClick={() => {
                      history.push(b('waitlist/select-dates'), { nextRoute: location.pathname });
                    }}
                  >
                    Join Waitlist
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.content}>
            <div className={styles.titleWrapper}>
              <h3 className={styles.title}>Patient Summary</h3>
              <div>
                <Button
                  className={styles.editLink}
                  onClick={() => this.props.history.push(b('patient-information'))}
                >
                  <BookingReviewSVG />
                  Edit
                </Button>
              </div>
            </div>
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
                value={`${patientUser.insuranceMemberId
                  || NOT_PROVIDED_TEXT} - ${patientUser.insuranceGroupId || NOT_PROVIDED_TEXT}`}
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

function mapStateToProps({ availabilities, entities, auth, widgetNavigation }) {
  const getPatientUser = availabilities.get('familyPatientUser') && auth.get('familyPatients').size > 0
    ? auth
      .get('familyPatients')
      .find(patient => patient.id === availabilities.get('familyPatientUser'))
    : false;

  const selectedPractitioner = entities.getIn([
    'practitioners',
    'models',
    availabilities.get('selectedPractitionerId'),
  ]);
  const selectedService = availabilities.get('selectedServiceId')
    && entities.getIn(['services', 'models', availabilities.get('selectedServiceId')]);
  const selectedDaysOfTheWeek = getSelectedDaysOfTheWeek(availabilities.get('waitSpot'));

  return {
    confirmedAvailability: availabilities.get('confirmedAvailability'),
    dateAndTime: availabilities.get('selectedAvailability'),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
    hasWaitList: selectedDaysOfTheWeek.size > 0,
    isAuth: auth.get('isAuthenticated'),
    isBooking: availabilities.get('isBooking'),
    notes: availabilities.get('notes'),
    officeHours: availabilities.get('officeHours').toJS(),
    patientUser: getPatientUser,
    selectedDaysOfTheWeek,
    selectedPractitioner,
    selectedService,
    timezone: availabilities.get('account').get('timezone'),
    user: auth.get('patientUser'),
    waitSpot: availabilities.get('waitSpot'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createRequest,
      createWaitSpot,
      hideButton,
      setIsClicked,
      setText,
      showButton,
      refreshFirstStepData,
    },
    dispatch,
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));

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
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  hasWaitList: PropTypes.bool.isRequired,
  hideButton: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isBooking: PropTypes.bool.isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  notes: PropTypes.string,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  refreshFirstStepData: PropTypes.func.isRequired,
  selectedDaysOfTheWeek: PropTypes.instanceOf(Map).isRequired,
  selectedPractitioner: PropTypes.oneOfType([PropTypes.instanceOf(Practitioner), PropTypes.string]),
  selectedService: PropTypes.oneOfType([PropTypes.instanceOf(Service), PropTypes.string]),
  setIsClicked: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  waitSpot: PropTypes.instanceOf(Map).isRequired,
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
};
