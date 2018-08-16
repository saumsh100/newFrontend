
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '../../../library';
import createAvailabilitiesFromOpening from '../../../../../server/lib/availabilities/createAvailabilitiesFromOpening';
import dateFormatter from '../../../../../iso/helpers/dateTimezone/dateFormatter';
import groupTimesPerPeriod from '../../../../../iso/helpers/dateTimezone/groupTimesPerPeriod';
import { setDateToTimezone } from '../../../../../server/util/time';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import Practitioner from '../../../../entities/models/Practitioners';
import Service from '../../../../entities/models/Service';
import { refreshAvailabilitiesState } from '../../../../reducers/availabilities';
import { officeHoursShape } from '../../../library/PropTypeShapes/officeHoursShape';
import { BookingConfirmedSVG } from '../../SVGs';
import { handleAvailabilitiesTimes } from '../Review/helpers';
import SummaryItem from '../Review/SummaryItem';
import { hideButton } from '../../../../reducers/widgetNavigation';
import styles from './styles.scss';
import { capitalizeFirstLetter } from '../../../Utils';

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
  waitlist,
  notes,
  ...props
}) {
  props.hideButton();
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
    endDate: setDateToTimezone(latestEndTime, timezone),
    duration: selectedService.get('duration'),
    interval: 60,
  }).reduce(groupTimesPerPeriod, {
    morning: [],
    afternoon: [],
    evening: [],
    total: 0,
  });

  /**
   * Display the dates selected on the waitlist's steps.
   * If is a regular range display the first and the last day,
   * otherwise display a list of dates.
   */
  const waitlistDates = (dates) => {
    if (dates.length === 0) {
      return null;
    }

    return dates.map(d => capitalizeFirstLetter(d)).join(', ');
  };

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

  const insuranceMemberAndGroupID = `${patientUser.insuranceMemberId ||
    NOT_PROVIDED_TEXT} - ${patientUser.insuranceGroupId || NOT_PROVIDED_TEXT}`;
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
            Your request has been submitted successfully. <br />
            We will be in touch soon, please wait for our confirmation.
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
                value={`${dateFormatter(
                  dateAndTime.startDate,
                  timezone,
                  'ddd, MMM Do',
                )} at ${dateFormatter(dateAndTime.startDate, timezone, 'h:mm a')}`}
              />
            </div>
            <hr />
            {waitlist.dates.length > 0 && (
              <div className={styles.bookingGroup}>
                <h4 className={styles.title}>Waitlist Details</h4>
                <SummaryItem
                  label="Available Dates"
                  value={waitlistDates(waitlist.dates, timezone)}
                />
                <SummaryItem label="Times" value={waitlistTimes()} />
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
        .find(patient => patient.id === availabilities.get('familyPatientUser'))
      : false;
  return {
    notes: availabilities.get('notes'),
    dateAndTime: availabilities.get('selectedAvailability'),
    officeHours: availabilities.get('officeHours').toJS(),
    timezone: availabilities.get('account').get('timezone'),
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
    waitlist: availabilities.get('waitlist').toJS(),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Complete);

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
  waitlist: PropTypes.shape({
    dates: PropTypes.arrayOf(PropTypes.string),
    times: PropTypes.arrayOf(PropTypes.string),
  }),
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
  waitlist: {
    dates: [],
    times: [],
  },
};
