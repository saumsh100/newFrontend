import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { getFormattedDate } from '../../../library';
import { Button } from '../../components';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import {
  refreshAvailabilitiesState,
  getSelectedDaysOfTheWeek,
} from '../../../../reducers/availabilities';
import officeHoursShape from '../../../library/PropTypeShapes/officeHoursShape';
import { BookingConfirmedSVG } from '../../SVGs';
import { availabilitiesGroupedByPeriod, waitlistDates, waitlistTimes } from '../Review/helpers';
import SummaryItem from '../Review/SummaryItem';
import { hideButton } from '../../../../reducers/widgetNavigation';
import styles from './styles.scss';

const NOT_PROVIDED_TEXT = 'Not Provided';

function Complete({
  dateAndTime,
  history,
  location,
  patientUser,
  selectedService,
  officeHours,
  selectedPractitioner,
  timezone,
  waitSpot,
  selectedDaysOfTheWeek,
  notes,
  ...props
}) {
  props.hideButton();

  /**
   * Generates the availabilities using the office openings,
   * also group them inside the specific time-frame.
   */
  const availabilities =
    selectedService &&
    availabilitiesGroupedByPeriod(
      Object.values(officeHours),
      timezone,
      selectedService.get('duration'),
    );

  const insuranceMemberAndGroupID = `${patientUser.insuranceMemberId || NOT_PROVIDED_TEXT} - ${
    patientUser.insuranceGroupId || NOT_PROVIDED_TEXT
  }`;
  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.svgWrapper}>
            <BookingConfirmedSVG />
          </div>
          <h1 className={styles.heading}>
            Thank You, {patientUser && `${patientUser.firstName} ${patientUser.lastName}`}!
          </h1>
          <p className={styles.description}>
            Your request has been submitted. <br />
            Please note that the time and date of your appointment <br />
            is not confirmed. We will be in touch within 1 – 2 business <br />
            days to confirm the appointment details with you.
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {dateAndTime && (
          <div className={styles.content}>
            <div className={styles.bookingGroup}>
              <h4 className={styles.title}>Appointment Details</h4>
              <SummaryItem label="Reason" value={selectedService.get('name')} />
              {selectedPractitioner && selectedPractitioner.getPrettyName() ? (
                <SummaryItem label="Practitioner" value={selectedPractitioner.getPrettyName()} />
              ) : (
                <SummaryItem label="Practitioner" value="No Preference" />
              )}
              <SummaryItem
                label="Date"
                value={`${getFormattedDate(
                  dateAndTime.startDate,
                  'ddd, MMM Do',
                  timezone,
                )} at ${getFormattedDate(dateAndTime.startDate, 'h:mm a', timezone)}`}
              />
            </div>
            <hr />
            {selectedDaysOfTheWeek.size > 0 && (
              <div className={styles.bookingGroup}>
                <h4 className={styles.title}>Waitlist Details</h4>
                <SummaryItem label="Available Dates" value={waitlistDates(selectedDaysOfTheWeek)} />
                <SummaryItem
                  label="Times"
                  value={waitlistTimes(waitSpot, availabilities, timezone)}
                />
              </div>
            )}
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.bookingGroup}>
            <h4 className={styles.title}>Patient Details</h4>
            <SummaryItem
              label="Patient"
              value={`${patientUser.firstName} ${patientUser.lastName}`}
            />
            <SummaryItem
              label="Insurance Carrier"
              value={`${patientUser.insuranceCarrier || NOT_PROVIDED_TEXT}`}
            />
            <SummaryItem label="Insurance Member ID & Group ID" value={insuranceMemberAndGroupID} />
            <SummaryItem label="Notes" value={notes || NOT_PROVIDED_TEXT} />
          </div>
        </div>
        <div className={styles.container}>
          <Button
            className={styles.actionButton}
            onClick={() => {
              props.refreshAvailabilitiesState();
              history.push({
                ...location,
                pathname: '../book/reason',
                state: {
                  ...location.state,
                  isCompleteRoute: false,
                },
              });
            }}
          >
            Start New Booking
          </Button>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps({ auth, availabilities, entities }) {
  const getPatientUser =
    availabilities.get('familyPatientUser') && auth.get('familyPatients').size > 0
      ? auth
          .get('familyPatients')
          .find((patient) => patient.id === availabilities.get('familyPatientUser'))
      : false;

  const selectedDaysOfTheWeek = getSelectedDaysOfTheWeek(availabilities.get('waitSpot'));

  return {
    notes: availabilities.get('notes'),
    dateAndTime: availabilities.get('selectedAvailability'),
    officeHours: availabilities.get('officeHours').toJS(),
    timezone: availabilities.get('account').get('timezone'),
    selectedDaysOfTheWeek,
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    selectedPractitioner: entities.getIn([
      'practitioners',
      'models',
      availabilities.get('selectedPractitionerId'),
    ]),
    patientUser: getPatientUser,
    waitSpot: availabilities.get('waitSpot'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      refreshAvailabilitiesState,
      hideButton,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Complete);

Complete.propTypes = {
  dateAndTime: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    practitionerId: PropTypes.string,
  }),
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  officeHours: PropTypes.shape(officeHoursShape).isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  selectedPractitioner: PropTypes.oneOfType([PropTypes.instanceOf(Practitioner), PropTypes.string]),
  selectedService: PropTypes.oneOfType([PropTypes.instanceOf(Service), PropTypes.string]),
  timezone: PropTypes.string.isRequired,
  refreshAvailabilitiesState: PropTypes.func.isRequired,
  waitSpot: PropTypes.instanceOf(Map).isRequired,
  selectedDaysOfTheWeek: PropTypes.instanceOf(Map).isRequired,
  notes: PropTypes.string,
  hideButton: PropTypes.func.isRequired,
};

Complete.defaultProps = {
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
