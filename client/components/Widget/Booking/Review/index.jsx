import moment from 'moment';
import keys from 'lodash/keys';
import omitBy from 'lodash/omitBy';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import styles from './styles.scss';
import data from './insurance_carriers';
import { Button, Link, TextArea, Input } from '../../../library';
import { setNotes, setInsuranceCarrier, setInsuranceMemberId } from '../../../../actions/availabilities';
import DropdownSuggestion from '../../../library/DropdownSuggestion/index';
import { createRequest, createWaitSpot } from '../../../../thunks/availabilities';

/**
 * This is the value that will turn the dropdown component,
 * into a input field component. This comes from the data source,
 * that right now is the insurance_carriers.js
 */
const DROPDOWN_TOGGLE_VALUE = 'other';

/**
 * Returns a string containing the key
 * of the values that are true or 'none';
 *
 * @param {object} object
 */
const generateCSW = (object) => {
  const filtered = keys(omitBy(object, value => !value));
  if (!filtered.length) { return 'none'; }
  return filtered.join(', ');
};

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carrier: 'insurance_1',
      customCarrier: '',
      insuranceCarrierError: '',
    };
    this.submitRequest = this.submitRequest.bind(this);
    this.setNotes = this.setNotes.bind(this);
    this.setInsuranceMemberId = this.setInsuranceMemberId.bind(this);
    this.handleCarrier = this.handleCarrier.bind(this);
    this.handleCarrierRendering = this.handleCarrierRendering.bind(this);
  }

  /**
   * Set an initial value to the redux state.
   */
  componentDidMount() {
    const label = data.find(opt => opt.value === this.state.carrier).label;
    this.props.setInsuranceCarrier(label);
    this.props.setInsuranceMemberId('');
  }
  /**
   * Fires the redux action.
   *
   * @param {object} e
   */
  setNotes(e) {
    this.props.setNotes(e.target.value);
  }

  /**
   * Fires the redux action.
   *
   * @param {object} e
   */
  setInsuranceMemberId(e) {
    this.props.setInsuranceMemberId(e.target.value);
  }

  /**
   * Before submiting the form let's check if
   * there's a provided insurance carrier.
   * If yes, just return the Promise,
   * otherwise alert the user and stop the request.
   */
  submitRequest() {
    if (this.state.carrier === DROPDOWN_TOGGLE_VALUE && !this.state.customCarrier) {
      return this.setState({
        insuranceCarrierError: "Please provide your insurance carrier's name.",
      });
    }
    const { selectedAvailability, hasWaitList } = this.props;

    const creationPromises = [];
    if (selectedAvailability) {
      creationPromises.push(this.props.createRequest());
    }

    if (hasWaitList) {
      creationPromises.push(this.props.createWaitSpot());
    }
    return Promise.all(creationPromises)
      .then(() => this.props.history.push('./complete'))
      .catch(err => console.error('Creating request failed', err));
  }

  /**
   * If the user selecfed the option other,
   * he should be allowed to display anything,
   * otherwise let's display the default label.
   *
   * @param {string} value
   */
  handleCarrierRendering(value) {
    if (this.state.carrier === DROPDOWN_TOGGLE_VALUE) {
      return value;
    }
    return data.find(el => el.value === value).label;
  }

  /**
   * If the actual carrier value is equal to DROPDOWN_TOGGLE_VALUE
   * and the passed data is not a valid "value" from the data source,
   * let's set it as a customCarrier value and fire the redux action.
   *
   * But if the user is changing between valid "value" data,
   * let's just update the carrier attribute and fire the redux action.
   *
   */
  handleCarrier(value) {
    const src = data.find(opt => opt.value === value);
    if (this.state.carrier === DROPDOWN_TOGGLE_VALUE && !src) {
      this.setState({ carrier: DROPDOWN_TOGGLE_VALUE, customCarrier: value, insuranceCarrierError: '' });
      return this.props.setInsuranceCarrier(value);
    } else if (src) {
      this.setState({ carrier: value, customCarrier: '', insuranceCarrierError: '' });
      const label = data.find(opt => opt.value === value).label;
      return this.props.setInsuranceCarrier(label);
    }
    return false;
  }

  render() {
    const { selectedAvailability, selectedService, hasWaitList, waitSpot, notes } = this.props;

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

    const renderWaitlistInformation = hasWaitList && (
      <div className={styles.boxWrapper}>
        <div className={styles.flexWrapper}>
          <div className={styles.label}>Waitlist Information</div>
          <div className={styles.editWrapper}>
            <Link to="../book/wait">
              <Button flat>Edit</Button>
            </Link>
          </div>
        </div>
        <div className={styles.well}>
          <div className={styles.bold}>Preferred Day of the Week:</div>
          <div>{preferredDays}</div>
          <div className={styles.bold}>Preferred Time:</div>
          <div>{preferredTime}</div>
        </div>
      </div>
    );

    const renderSelectedAvailability = selectedAvailability && (
      <div className={styles.boxWrapper}>
        <div className={styles.flexWrapper}>
          <div className={styles.label}>Appointment Summary</div>
          <div className={styles.editWrapper}>
            <Link to="../book"><Button flat>Edit</Button></Link>
          </div>
        </div>
        <div className={styles.well}>
          <div className={styles.service}>{serviceName}</div>
          <div className={styles.date}>{selectedDay}</div>
        </div>
      </div>
    );

    return (
      <div className={styles.reviewAndBookWrapper}>
        {renderSelectedAvailability}
        {renderWaitlistInformation}
        <div className={styles.preferencesWrapper}>
          <div className={styles.fieldWrapper}>
            <div className={styles.label}>Insurance Carrier</div>
            <DropdownSuggestion
              options={data}
              renderValue={this.handleCarrierRendering}
              value={this.state.carrier}
              showAsInput={DROPDOWN_TOGGLE_VALUE}
              toggleAsInput={() => { this.handleCarrier('insurance_1'); }}
              onChange={this.handleCarrier}
              placeholder="Your insurance carrier's name"
              theme={{ slotButton: styles.reviewAndBookSlot, wrapper: styles.reviewAndBookInputWrapper }}
              name="insuranceCarrier"
              label=""
              error={this.state.insuranceCarrierError}
              data-test-id="text"
              required
            />
          </div>
          {this.state.carrier !== 'insurance_1' &&
            <div className={styles.fieldWrapper}>
              <div className={styles.label}>Patient insurance member ID</div>
              <Input
                classStyles={styles.reviewAndBookInputWrapper}
                theme={{ input: styles.reviewAndBookPlaceholder }}
                onChange={this.setInsuranceMemberId}
                placeholder="Optional"
                iconType="solid"
                icon="question-circle"
              />
            </div>
          }
        </div>
        <div className={styles.label}>Notes for the Dental Office</div>
        <TextArea
          value={notes || ''}
          maxLength="255"
          onChange={this.setNotes}
          classStyles={styles.textArea}
        />
        <div className={styles.submitButtonWrapper}>
          <Button onClick={this.submitRequest}>
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
    setInsuranceMemberId,
    setInsuranceCarrier,
    createRequest,
    createWaitSpot,
  }, dispatch);
}

function mapStateToProps({ auth, availabilities, entities }) {
  return {
    user: auth.get('patientUser'),
    hasWaitList: availabilities.get('hasWaitList'),
    waitSpot: availabilities.get('waitSpot'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    notes: availabilities.get('notes'),
    selectedService: entities.getIn(['services', 'models', availabilities.get('selectedServiceId')]),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));

Review.propTypes = {
  createWaitSpot: PropTypes.func,
  selectedAvailability: PropTypes.object,
  hasWaitList: PropTypes.bool,
  setNotes: PropTypes.func,
  setInsuranceMemberId: PropTypes.func,
  setInsuranceCarrier: PropTypes.func,
  user: PropTypes.object,
  notes: PropTypes.string,
  createRequest: PropTypes.func,
  history: PropTypes.object,
  selectedService: PropTypes.object,
  waitSpot: PropTypes.object,
};
