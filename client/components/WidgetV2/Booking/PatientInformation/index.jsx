
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import merge from 'lodash/merge';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { change as handleChange, formValueSelector, SubmissionError } from 'redux-form';
import carriers from './insurance_carriers';
import { Button, Field, Form, IconButton, Loading } from '../../../library';
import { fetchFamilyPatients } from '../../../../thunks/familyPatients';
import {
  emailValidate,
  composeAsyncValidators,
  normalizeBirthdate,
  validateBirthdate,
} from '../../../library/Form/validate';
import { normalizePhone } from '../../../library/Form/normalize';
import { SortByFirstName } from '../../../library/util/SortEntities';
import { setFamilyPatientUser } from '../../../../actions/availabilities';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import styles from './styles.scss';

/**
 * Gender's array
 */
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

/**
 * Find the first option that matches the passed string.
 *
 * @param {array} data
 * @param {string} value
 */
const validateField = (data, value) => data.find(item => item.value === value);

const initialValues = {
  customCarrier: false,
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  phoneNumber: '',
  gender: '',
  insuranceCarrier: '',
  insuranceMemberId: '',
  insuranceGroupId: '',
  patientUser: '',
};

class PatientInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.fetchFamilyPatients() && false,
    };
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.handlePatientChanges = this.handlePatientChanges.bind(this);

    if (props.familyPatientUser) {
      const patient = this.getPatient(props.familyPatientUser);
      patient.birthDate = patient.birthDate ? moment(patient.birthDate).format('MM/DD/YYYY') : '';
      merge(initialValues, patient, {
        patientUser: props.familyPatientUser,
      });
    }
  }

  componentDidMount() {
    const patient = this.getPatient(this.props.familyPatientUser);
    if (!patient || !patient.insuranceCarrier) {
      return false;
    }
    if (carriers.find(carrier => carrier.value === patient.insuranceCarrier)) {
      this.props.change('patientInformation', 'customCarrier', false);
    } else {
      this.props.change('patientInformation', 'customCarrier', true);
    }
    return this.props.change('patientInformation', 'insuranceCarrier', patient.insuranceCarrier);
  }

  /**
   * If the user selected Other as insurance carrier,
   * set the custom-carrier attribute to true.
   */
  componentWillUpdate(nextProps) {
    const { isCustomCarrier, insuranceCarrierValue, change } = nextProps;
    if (insuranceCarrierValue === 'Other' && isCustomCarrier === false) {
      change('patientInformation', 'customCarrier', true);
      change('patientInformation', 'insuranceCarrier', '');
    }
  }

  /**
   *
   *
   * @param {string} patientId
   */
  getPatient(patientId) {
    return this.props.familyPatients.find(patient => patient.id === patientId);
  }

  /**
   *
   * @param {*} _
   * @param {string} patientId
   */
  handlePatientChanges(_, patientId) {
    const { change } = this.props;
    this.props.setFamilyPatientUser(patientId);
    const patient = this.getPatient(patientId);
    let isCustomCarrier = false;
    if (patient) {
      patient.birthDate = patient.birthDate ? moment(patient.birthDate).format('MM/DD/YYYY') : '';
      isCustomCarrier = !carriers.some(carrier => carrier.value === patient.insuranceCarrier);
    }
    Object.keys(initialValues).map(key =>
      change(
        'patientInformation',
        key,
        (patient && patient[key]) || (key === 'customCarrier' ? isCustomCarrier : '')
      )
    );
  }

  async updateUserProfile(values) {
    const { familyPatientUser, user } = this.props;
    /**
     * If there's not patientUser or we are not able to find
     * the uid on the familyPatients list.
     */
    if (
      !familyPatientUser ||
      (familyPatientUser !== 'new' && !this.getPatient(familyPatientUser))
    ) {
      return false;
    }
    /**
     * If the patientUser is new, let's create a new family member.
     */
    if (familyPatientUser === 'new') {
      try {
        const newPatient = await axios.post(
          `/families/${user.patientUserFamilyId}/patients`,
          values
        );
        await this.props.setFamilyPatientUser(newPatient.data.id);
      } catch (err) {
        console.error('Error updating patient!', err);
      }
    } else {
      try {
        await axios.put(
          `/families/${user.patientUserFamilyId}/patients/${familyPatientUser}`,
          values
        );
        await this.props.fetchFamilyPatients();
      } catch (err) {
        console.error('Error updating patient!', err);
      }
    }
    return this.props.history.push('./additional-information');
  }

  render() {
    /**
     * Wait until we fetch the family patients.
     */
    if (this.state.isLoading) {
      return <Loading />;
    }
    const { isCustomCarrier, change, familyPatients, familyPatientUser } = this.props;

    let patients = familyPatients.sort(SortByFirstName).map(patient => ({
      value: patient.id,
      label: `${patient.firstName} ${patient.lastName}`,
    }));
    patients = [...patients, { value: 'new', label: 'Someone Else' }];

    /**
     * Check if the passed email is not already used,
     * but first check if the email is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncEmailValidation = (values) => {
      const patient = this.getPatient(this.props.familyPatientUser);
      if (!values.email || (patient && values.email === patient.email)) {
        return false;
      }
      return axios.post('/patientUsers/email', { email: values.email }).then((response) => {
        if (response.data.exists) {
          throw new SubmissionError({ email: 'There is already a user with that email' });
        }
      });
    };
    /**
     * Check if the passed phoneNumber is not already used,
     * but first check if the phoneNumber is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncPhoneNumberValidation = (values) => {
      const patient = this.getPatient(this.props.familyPatientUser);
      if (
        !values.phoneNumber ||
        (patient && values.phoneNumber === patient.phoneNumber) ||
        (patient && values.phoneNumber === normalizePhone(patient.phoneNumber))
      ) {
        return false;
      }
      return axios
        .post('/patientUsers/phoneNumber', { phoneNumber: values.phoneNumber })
        .then((response) => {
          const { error } = response.data;
          if (error) {
            throw new SubmissionError({ phoneNumber: error });
          }
        });
    };
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <Form
            ignoreSaveButton
            form="patientInformation"
            initialValues={initialValues}
            onSubmit={this.updateUserProfile}
            asyncValidate={composeAsyncValidators([
              asyncEmailValidation,
              asyncPhoneNumberValidation,
            ])}
            asyncBlurFields={['email', 'phoneNumber']}
          >
            <div className={styles.content}>
              <h3 className={styles.title}>Select the Patient</h3>
              <p className={styles.subtitle}>Please select who's going to the clinic.</p>
              <div className={styles.patientWrapper}>
                <Field
                  name="patientUser"
                  label="Who will be seeing the dentist?"
                  component={SuggestionSelect}
                  onChange={this.handlePatientChanges}
                  required
                  theme={{
                    wrapper: styles.wrapper,
                    toggleDiv: styles.input,
                    caretIconWrapper: styles.caretIconWrapper,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    error: styles.error,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  validateValue={value => validateField(patients, value) || value === null}
                  renderValue={value =>
                    (value === 'Someone Else' || value === ''
                      ? value
                      : patients.find(patient => patient.value === value).label)
                  }
                  options={patients}
                  data-test-id="gender"
                />
              </div>
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>Patient Information</h3>
              <p className={styles.subtitle}>Fill your data to finish your booking.</p>
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                name="firstName"
                label="First Name"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                name="lastName"
                label="Last Name"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Email"
                name="email"
                type="email"
                validate={[emailValidate]}
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                normalize={normalizeBirthdate}
                validate={[validateBirthdate]}
                name="birthDate"
                label="Birth Date"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                name="phoneNumber"
                type="tel"
                label="Phone Number"
              />
              <div className={styles.group}>
                <Field
                  name="gender"
                  label="Gender"
                  component={SuggestionSelect}
                  required
                  theme={{
                    wrapper: styles.wrapper,
                    toggleDiv: styles.input,
                    caretIconWrapper: styles.caretIconWrapper,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    error: styles.error,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  validateValue={value => validateField(genders, value) || value === ''}
                  renderValue={value =>
                    (validateField(genders, value) && validateField(genders, value).label) || ''
                  }
                  options={genders}
                  data-test-id="gender"
                />
              </div>
              {isCustomCarrier ? (
                <Field
                  theme={{
                    inputWithIcon: styles.inputWithIcon,
                    iconClassName: styles.validationIcon,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    group: styles.group,
                    error: styles.error,
                    erroredInput: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  iconComponent={
                    <IconButton
                      icon="times"
                      iconType="light"
                      className={styles.closeIcon}
                      onClick={() => {
                        change('patientInformation', 'customCarrier', false);
                        change('patientInformation', 'insuranceCarrier', '');
                        return false;
                      }}
                    />
                  }
                  name="insuranceCarrier"
                  label="Insurance Carrier"
                />
              ) : (
                <div className={styles.group}>
                  <Field
                    name="insuranceCarrier"
                    label="Insurance Carrier"
                    component={SuggestionSelect}
                    theme={{
                      wrapper: styles.wrapper,
                      toggleDiv: styles.input,
                      caretIconWrapper: styles.caretIconWrapper,
                      erroredLabelFilled: styles.erroredLabelFilled,
                      input: styles.input,
                      filled: styles.filled,
                      label: styles.label,
                      error: styles.error,
                      errorIcon: styles.errorIcon,
                      errorToggleDiv: styles.erroredInput,
                      bar: styles.bar,
                      erroredLabel: styles.erroredLabel,
                    }}
                    validateValue={value => validateField(carriers, value) || value === null}
                    renderValue={value =>
                      (validateField(carriers, value) && validateField(carriers, value).label) || ''
                    }
                    options={carriers}
                    data-test-id="insuranceCarrier"
                  />
                </div>
              )}
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Insurance Member ID"
                name="insuranceMemberId"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Group ID"
                name="insuranceGroupId"
              />
              <Button type="submit" className={styles.actionButton} disabled={!familyPatientUser}>
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFamilyPatients,
      setFamilyPatientUser,
      change: handleChange,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  const selector = formValueSelector('patientInformation');
  const { auth, availabilities } = state;
  return {
    user: auth.get('patientUser'),
    isCustomCarrier: selector(state, 'customCarrier'),
    familyPatients: auth.get('familyPatients'),
    familyPatientUser: availabilities.get('familyPatientUser'),
    insuranceCarrierValue: selector(state, 'insuranceCarrier'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientInformation));

PatientInformation.propTypes = {
  isCustomCarrier: PropTypes.bool,
  change: PropTypes.func,
  familyPatientUser: PropTypes.string,
  history: PropTypes.shape(historyShape),
  fetchFamilyPatients: PropTypes.func,
  familyPatients: PropTypes.arrayOf(PropTypes.shape(patientUserShape)),
  insuranceCarrierValue: PropTypes.string,
  setFamilyPatientUser: PropTypes.func,
};
