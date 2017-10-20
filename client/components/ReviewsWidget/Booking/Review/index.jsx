
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import keys from 'lodash/keys';
import omitBy from 'lodash/omitBy';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Link,
  TextArea,
} from '../../../library';
import { createRequest, createWaitSpot } from '../../../../thunks/availabilities';
import { setNotes } from '../../../../actions/availabilities';
import styles from './styles.scss';

const generateCSW = (object) => {
  // Get true keys
  const filtered = keys(omitBy(object, value => !value));
  if (!filtered.length) {
    return 'none';
  }

  return filtered.join(', ');
};

class Review extends Component {
  constructor(props) {
    super(props);

    this.submitRequest = this.submitRequest.bind(this);
    this.setNotes = this.setNotes.bind(this);
  }

  submitRequest() {
    const { selectedAvailability, hasWaitList } = this.props;

    const creationPromises = [];
    if (selectedAvailability) {
      creationPromises.push(this.props.createRequest());
    }

    if (hasWaitList) {
      creationPromises.push(this.props.createWaitSpot());
    }

    Promise.all(creationPromises)
      .then(() => {
        this.props.history.push('./complete');
      })
      .catch(err => console.error('Creating request failed', err));
  }

  setNotes(e) {
    this.props.setNotes(e.target.value);
  }

  render() {
    const {
      selectedAvailability,
      selectedService,
      hasWaitList,
      waitSpot,
      notes,
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
      <div className={styles.reviewAndBookWrapper}>
        {selectedAvailability ?
          <div>
            <div className={styles.label}>
              Appointment Summary
            </div>
            <div className={styles.well}>
              <div className={styles.service}>{serviceName}</div>
              <div className={styles.date}>{selectedDay}</div>
            </div>
            <div className={styles.editWrapper}>
              <Link to="../book">
                <Button
                  flat
                >
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        : null}
        {hasWaitList ?
          <div>
            <div className={styles.label}>
              Waitlist Information
            </div>
            <div className={styles.well}>
              <div className={styles.bold}>Preferred Day of the Week:</div>
              <div>{preferredDays}</div>
              <div className={styles.bold}>Preferred Time:</div>
              <div>{preferredTime}</div>
            </div>
            <div className={styles.editWrapper}>
              <Link to="../book/wait">
                <Button
                  flat
                >
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        : null}
        <div className={styles.label}>
          Notes for the Dental Office
        </div>
        <TextArea
          value={notes}
          onChange={this.setNotes}
          classStyles={styles.textArea}
        />
        <div className={styles.submitButtonWrapper}>
          <Button
            onClick={this.submitRequest}
          >
            Submit Request
          </Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setNotes,
    createRequest,
    createWaitSpot,
  }, dispatch);
}

function mapStateToProps({ availabilities, entities }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
    waitSpot: availabilities.get('waitSpot'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    notes: availabilities.get('notes'),
    selectedService: entities.getIn(['services', 'models', availabilities.get('selectedServiceId')]),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
