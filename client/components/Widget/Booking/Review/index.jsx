
import React, { Component } from 'react';
import moment from 'moment-timezone';
import keys from 'lodash/keys';
import omitBy from 'lodash/omitBy';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import data from './insurance_carriers';
import {
  Button,
  Link,
  TextArea,
  Input,
  Tooltip,
  Icon,
  Loading,
} from '../../../library';
import {
  setNotes,
  setInsuranceCarrier,
  setInsuranceMemberId,
  setFamilyPatientUser,
} from '../../../../actions/availabilities';
import {
  createRequest,
  createWaitSpot,
} from '../../../../thunks/availabilities';
import { fetchFamilyPatients } from '../../../../thunks/familyPatients';
import InsuranceCarrier from './InsuranceCarrier';
import FamilyPatient from './FamilyPatient';
import styles from './styles.scss';
/**
 * This is the value that will turn the dropdown component
 * into a input field component.
 * This comes from the data source (insurance_carriers.js)
 */
const DROPDOWN_TOGGLE_VALUE = 'Other';

/**
 * This is the default value of the insurance's list
 * we use it to manage the insurance's member id field,
 * since this value won't require/accept a insurance's member id,
 * consequently we don't display the member's id input, when this is the actual value.
 */
const DEFAULT_VALUE = 'Pay for myself';

/**
 * Returns a string containing the key
 * of the values that are true or 'none';
 *
 * @param {object} object
 */
const generateCSW = (object) => {
  const filtered = keys(omitBy(object, value => !value));
  if (!filtered.length) {
    return 'none';
  }
  return filtered.join(', ');
};

/**
 * Icon showing a Tooltip on the
 * insurance's member id field.
 */
const iconMemberId = (
  <Tooltip
    placement="left"
    overlay={
      <span>
        The ID is presented on your <br /> insurance's carrier card.
      </span>
    }
    trigger={['click', 'hover']}
  >
    <div className={styles.iconWrapper}>
      <Icon type="solid" icon="question-circle" />
    </div>
  </Tooltip>
);

/**
 * Helper function to search for a carrier on the data source,
 * using the value and the scope of the search, by default we look on the labels.
 *
 * @param {string} carrierLabel
 * @param {string} key
 */
const findCarrierBy = (carrierLabel, key = 'label') =>
  data.find(opt => opt[key] === carrierLabel);

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customCarrier: !findCarrierBy(props.selectedInsuranceCarrier),
      insuranceCarrierError: '',
      isLoading: true,
    };

    this.submitRequest = this.submitRequest.bind(this);
    this.setNotes = this.setNotes.bind(this);
    this.setInsuranceMemberId = this.setInsuranceMemberId.bind(this);
    this.handleCarrier = this.handleCarrier.bind(this);
    this.handlePatient = this.handlePatient.bind(this);

    /**
     * If we don't have a selectedPatient
     * let's use the current user as default.
     */
    if (!props.familyPatientUser) {
      this.handlePatient(props.user.id);
    }

    /**
     * Fetch the family patients,
     * after fetching set the loading as false.
     */
    props.fetchFamilyPatients().then(() => this.setState({ isLoading: false }));
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
   * there's an insurance carrier.
   * If not alert the user and stop the request.
   */
  submitRequest() {
    if (!this.props.selectedInsuranceCarrier) {
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
   * Set the selected patientId
   *
   * @param {string} value
   */
  handlePatient(value) {
    this.props.setFamilyPatientUser(value);
  }

  /**
   * We support custom carrier and those on the defined list.
   *
   * With the provied value, we will try to find the key on the original list.
   * If we find it and the customCarrier state is false, let's set the Insurance Carrier
   * using the label inside of the list.
   *
   * Otherwise we have a custom carrier,
   * meaning that the user can type anything on the custom field.
   *
   */
  handleCarrier(carrierValue) {
    const carrier = findCarrierBy(carrierValue, 'value');

    /**
     * Custom carrier
     */
    if (this.state.customCarrier && !carrier) {
      return this.props.setInsuranceCarrier(carrierValue);
    }

    const isCustomCarrier = carrier.label === DROPDOWN_TOGGLE_VALUE;

    this.setState({
      customCarrier: isCustomCarrier,
      insuranceCarrierError: '',
    });

    /**
     * For a better UX, when the user select a custom carrier,
     * let's clean the input field, showing just the placeholder.
     */
    const finalValue = isCustomCarrier ? '' : carrier.label;

    /**
     * When it's Pay for myself, we don't need to support insurance's member id.
     */
    if (carrier.label === DEFAULT_VALUE) {
      this.props.setInsuranceMemberId('');
    }

    return this.props.setInsuranceCarrier(finalValue);
  }

  render() {
    /**
     * Wait until we fetch the family patients.
     */
    if (this.state.isLoading) {
      return <Loading />;
    }

    const {
      selectedAvailability,
      selectedService,
      hasWaitList,
      waitSpot,
      notes,
    } = this.props;

    let serviceName = null;
    let selectedDay = null;
    let preferredDays = null;
    let preferredTime = null;

    if (selectedAvailability) {
      serviceName = selectedService.get('name');
      const mDate = moment.tz(selectedAvailability.startDate, this.props.accountTimezone);
      selectedDay = `${mDate.format('ddd, MMM Do')} at ${mDate.format('h:mm a')}`;
    }

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
            <Link to="../book">
              <Button flat>Edit</Button>
            </Link>
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
          <div className={[styles.fieldWrapper]}>
            <div className={styles.label}>Who will be seeing the dentist?</div>
            <FamilyPatient
              familyPatients={this.props.familyPatients}
              value={this.props.familyPatientUser}
              onChange={this.handlePatient}
              userId={this.props.user.id}
            />
          </div>
          <div
            className={classnames(styles.fieldWrapper, styles.flexibleField)}
          >
            <div className={styles.label}>Insurance Carrier</div>
            <InsuranceCarrier
              error={this.state.insuranceCarrierError}
              onChange={this.handleCarrier}
              value={this.props.selectedInsuranceCarrier}
              isCustomCarrier={this.state.customCarrier}
            />
          </div>
          {this.props.selectedInsuranceCarrier !== DEFAULT_VALUE && (
            <div
              className={classnames(styles.fieldWrapper, styles.flexibleField)}
            >
              <div className={styles.label}>Patient insurance member ID</div>
              <Input
                name="insuranceMemberId"
                value={this.props.insuranceMemberId}
                iconComponent={iconMemberId}
                placeholder="Optional"
                onChange={this.setInsuranceMemberId}
                classStyles={styles.reviewAndBookInputWrapper}
                theme={{ input: styles.reviewAndBookPlaceholder }}
              />
            </div>
          )}
        </div>
        <div className={styles.label}>Notes for the Dental Office</div>
        <TextArea
          maxLength="255"
          value={notes || ''}
          onChange={this.setNotes}
          classStyles={styles.textArea}
        />
        <div className={styles.submitButtonWrapper}>
          <Button onClick={this.submitRequest}>Submit Request</Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFamilyPatients,
      setNotes,
      setFamilyPatientUser,
      setInsuranceMemberId,
      setInsuranceCarrier,
      createRequest,
      createWaitSpot,
    },
    dispatch,
  );
}

function mapStateToProps({ auth, availabilities, entities }) {
  return {
    user: auth.get('patientUser'),
    familyPatients: auth.get('familyPatients'),
    hasWaitList: availabilities.get('hasWaitList'),
    waitSpot: availabilities.get('waitSpot'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    selectedInsuranceCarrier: availabilities.get('insuranceCarrier'),
    insuranceMemberId: availabilities.get('insuranceMemberId'),
    notes: availabilities.get('notes'),
    accountTimezone: availabilities.get('account').get('timezone'),
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
    familyPatientUser: availabilities.get('familyPatientUser'),
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Review));

Review.propTypes = {
  createWaitSpot: PropTypes.func,
  selectedAvailability: PropTypes.object,
  hasWaitList: PropTypes.bool,
  setNotes: PropTypes.func,
  accountTimezone: PropTypes.string,
  setInsuranceMemberId: PropTypes.func,
  setInsuranceCarrier: PropTypes.func,
  user: PropTypes.object,
  notes: PropTypes.string,
  createRequest: PropTypes.func,
  history: PropTypes.object,
  selectedService: PropTypes.object,
  waitSpot: PropTypes.object,
  familyPatientUser: PropTypes.shape({
    birthDate: PropTypes.string,
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    id: PropTypes.string,
    isEmailConfirmed: PropTypes.bool,
    isPhoneNumberConfirmed: PropTypes.bool,
    patientUserFamilyId: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  fetchFamilyPatients: PropTypes.func,
  setFamilyPatientUser: PropTypes.func,
  insuranceMemberId: PropTypes.string,
  familyPatients: PropTypes.arrayOf(PropTypes.shape({
    birthDate: PropTypes.string,
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    id: PropTypes.string,
    isEmailConfirmed: PropTypes.bool,
    isPhoneNumberConfirmed: PropTypes.bool,
    patientUserFamilyId: PropTypes.string,
    phoneNumber: PropTypes.string,
  })),
};
