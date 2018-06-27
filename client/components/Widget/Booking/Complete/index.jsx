
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import keys from 'lodash/keys';
import omitBy from 'lodash/omitBy';
import { Button, Link } from '../../../library';
import { refreshAvailabilitiesState } from '../../../../actions/availabilities';
import styles from './styles.scss';

const generateCSW = (object) => {
  // Get true keys
  const filtered = keys(omitBy(object, value => !value));
  if (!filtered.length) {
    return 'none';
  }

  return filtered.join(', ');
};

class Complete extends Component {
  constructor(props) {
    super(props);

    this.complete = this.complete.bind(this);
  }

  complete() {
    this.props.refreshAvailabilitiesState();
    this.props.history.push('../book');
  }

  render() {
    const {
      selectedAvailability,
      selectedService,
      hasWaitList,
      waitSpot,
    } = this.props;

    let serviceName = null;
    let selectedDay = null;
    if (selectedAvailability) {
      serviceName = selectedService.get('name');

      const mDate = moment(selectedAvailability.startDate);
      selectedDay = `${mDate.format('ddd, MMM Do')} at ${mDate.format('h:mm a')}`;
    }

    let preferredDays = null;
    let preferredTime = null;
    if (hasWaitList) {
      preferredDays = generateCSW(waitSpot.get('daysOfTheWeek').toJS());
      preferredTime = generateCSW(waitSpot.get('preferences').toJS());
    }

    return (
      <div className={styles.completedWrapper}>
        <div className={styles.header}>Thank you!</div>
        <div className={styles.message}>
          Your appointment has been successfully requested. We will be in touch
          shortly. Please wait for our confirmation.
        </div>
        {selectedAvailability ? (
          <div>
            <div className={styles.label}>Appointment Summary</div>
            <div className={styles.well}>
              <div className={styles.service}>{serviceName}</div>
              <div className={styles.date}>{selectedDay}</div>
            </div>
          </div>
        ) : null}
        {hasWaitList ? (
          <div>
            <div className={styles.label}>Waitlist Information</div>
            <div className={styles.well}>
              <div className={styles.bold}>Preferred Day of the Week:</div>
              <div>{preferredDays}</div>
              <div className={styles.bold}>Preferred Time:</div>
              <div>{preferredTime}</div>
            </div>
          </div>
        ) : null}
        <div className={styles.doneButtonWrapper}>
          <Button onClick={this.complete}>Sounds good. Take me back</Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      refreshAvailabilitiesState,
    },
    dispatch,
  );
}

function mapStateToProps({ availabilities, entities }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
    waitSpot: availabilities.get('waitSpot'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    notes: availabilities.get('notes'),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Complete));
