
import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { change, formValueSelector } from 'redux-form';
import carriers from './insurance_carriers';
import { Button, Field, Form, IconButton, Loading } from '../../../library';
import {
  addNewFamilyPatient,
  fetchFamilyPatients,
  updateFamilyPatient,
} from '../../../../thunks/familyPatients';
import {
  emailValidate,
  composeAsyncValidators,
  normalizeBirthdate,
  validateBirthdate,
} from '../../../library/Form/validate';
import { normalizePhone } from '../../../library/Form/normalize';
import { SortByFirstName } from '../../../library/util/SortEntities';
import { setFamilyPatientUser, setPatientUser } from '../../../../actions/availabilities';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import styles from './styles.scss';

/**
 * Gender's array
 */
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const NEW_PATIENT = 'new';

/**
 * Find the first option that matches the passed string.
 *
 * @param {array} data
 * @param {string} value
 */
const validateField = (data, value) => data.find(item => item.value === value);

const defaultValues = {
  birthDate: '',
  customCarrier: false,
  email: '',
  firstName: '',
  gender: '',
  insuranceCarrier: carriers[0].value,
  insuranceGroupId: '',
  insuranceMemberId: '',
  lastName: '',
  patientUser: '',
  phoneNumber: '',
};

class PatientInformation extends Component {
  constructor(props) {
    super(props);

    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.handlePatientChanges = this.handlePatientChanges.bind(this);
  }

  componentDidMount() {
    this.props.fetchFamilyPatients();
    const patient = this.props.patientUser;
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
  componentWillUpdate({ insuranceCarrierValue, ...nextProps }) {
    if (insuranceCarrierValue === carriers[1]) {
      nextProps.change('patientInformation', 'customCarrier', true);
      nextProps.change('patientInformation', 'insuranceCarrier', '');
    }
  }

  /**
   *
   * @param {*} _
   * @param {string} patientId
   */
  handlePatientChanges(_, patientId) {
    const { familyPatients } = this.props;
    this.props.setFamilyPatientUser(patientId);
    const patient = familyPatients.find(pt => pt.id === patientId);
    let isCustomCarrier = false;
    if (patient) {
      patient.birthDate = patient.birthDate ? moment(patient.birthDate).format('MM/DD/YYYY') : '';
      isCustomCarrier =
        patient.insuranceCarrier &&
        !carriers.some(carrier => carrier.value === patient.insuranceCarrier);
    }
    Object.keys(defaultValues).map(key =>
      this.props.change(
        'patientInformation',
        key,
        (patient && patient[key]) ||
          (key === 'customCarrier' ? isCustomCarrier : defaultValues[key]),
      ));
  }

  async updateUserProfile(values) {
    const { familyPatientUser, location } = this.props;

    /**
     * Checks if there are a specific route to go onclicking a card or just the default one.
     */
    const contextualUrl =
      (location.state && location.state.nextRoute) || './additional-information';

    /**
     * If there's not patientUser or we are not able to find
     * the uid on the familyPatients list.
     */
    if (!familyPatientUser || (familyPatientUser !== NEW_PATIENT && !this.props.patientUser)) {
      return false;
    }

    /**
     * If the patientUser is new, let's create a new family member.
     */
    if (familyPatientUser === NEW_PATIENT) {
      try {
        const newPatient = await this.props.addNewFamilyPatient(values);
        this.props.setFamilyPatientUser(newPatient.data.id);
        await this.props.fetchFamilyPatients();
        this.props.setPatientUser(this.props.patientUser);
        return this.props.history.push(contextualUrl);
      } catch (err) {
        console.error('Error creating patient!', err);
      }
    }
    try {
      await this.props.updateFamilyPatient(values, familyPatientUser);
      await this.props.fetchFamilyPatients();
      this.props.setPatientUser(this.props.patientUser);
      return this.props.history.push(contextualUrl);
    } catch (err) {
      console.error('Error updating patient!', err);
    }
    return false;
  }

  /**
   * Check if the user is changing the form,
   * but did not select any patient yet set the patientUser to a new-one.
   *
   * @param {object} values
   */
  handleFormChanges(values) {
    if (values && !values.patientUser) {
      this.props.change('patientInformation', 'patientUser', NEW_PATIENT);
    }
  }

  render() {
    /**
     * Wait until we fetch the family patients.
     */
    if (this.props.isLoading) {
      return <Loading />;
    }
    const { isCustomCarrier, familyPatients, familyPatientUser } = this.props;

    let patients = familyPatients.sort(SortByFirstName).map(patient => ({
      value: patient.id,
      label: `${patient.firstName} ${patient.lastName}`,
    }));
    patients = [...patients, { value: NEW_PATIENT, label: 'Someone Else' }];

    /**
     * Check if the passed email is not already used,
     * but first check if the email is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncEmailValidation = (values) => {
      const patient = this.props.patientUser;
      if (!values.email || (patient && values.email === patient.email)) {
        return false;
      }
      return axios.post('/patientUsers/email', { email: values.email }).then((response) => {
        if (response.data.exists) {
          const emailError = {
            email: 'There is already a user with that email',
          };
          throw emailError;
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
      const patient = this.props.patientUser;
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
            throw error;
          }
        });
    };
    /**
     * If there's a patient already selected,
     * set his data on the initialValues,
     * otherwise use the default data.
     */
    const { patientUser, familyPatientUser: patientId } = this.props;
    const initialValues =
      patientUser && patientId
        ? {
          ...defaultValues,
          ...patientUser,
          patientUser: patientId,
          birthDate: patientUser.birthDate
            ? moment(patientUser.birthDate).format('MM/DD/YYYY')
            : '',
        }
        : defaultValues;
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <Form
            ignoreSaveButton
            form="patientInformation"
            initialValues={initialValues}
            onChange={this.handleFormChanges}
            onSubmit={this.updateUserProfile}
            asyncValidate={composeAsyncValidators([
              asyncEmailValidation,
              asyncPhoneNumberValidation,
            ])}
            asyncBlurFields={['email', 'phoneNumber']}
          >
            <div className={styles.content}>
              <h3 className={styles.title}>Select the Patient</h3>
              <p className={styles.subtitle}>Please select who is going to the clinic.</p>
              <div className={styles.patientWrapper}>
                <Field
                  name="patientUser"
                  label="Who will be seeing the dentist?"
                  component={SuggestionSelect}
                  onChange={this.handlePatientChanges}
                  required
                  theme={{
                    bar: styles.bar,
                    caretIconWrapper: styles.caretIconWrapper,
                    error: styles.error,
                    erroredLabel: styles.erroredLabel,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    filled: styles.filled,
                    input: styles.input,
                    label: styles.label,
                    toggleDiv: styles.input,
                    wrapper: styles.wrapper,
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
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
                }}
                required
                name="firstName"
                label="First Name"
              />
              <Field
                theme={{
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
                }}
                required
                name="lastName"
                label="Last Name"
              />
              <Field
                theme={{
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
                }}
                label="Email"
                name="email"
                type="email"
                validate={[emailValidate]}
              />
              <Field
                theme={{
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
                }}
                required
                normalize={normalizeBirthdate}
                validate={[validateBirthdate]}
                name="birthDate"
                label="Birth Date"
              />
              <Field
                theme={{
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
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
                    bar: styles.bar,
                    caretIconWrapper: styles.caretIconWrapper,
                    error: styles.error,
                    erroredLabel: styles.erroredLabel,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    filled: styles.filled,
                    input: styles.input,
                    label: styles.label,
                    toggleDiv: styles.input,
                    wrapper: styles.wrapper,
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
                    bar: styles.bar,
                    error: styles.error,
                    erroredInput: styles.erroredInput,
                    erroredLabel: styles.erroredLabel,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    filled: styles.filled,
                    group: styles.group,
                    iconClassName: styles.validationIcon,
                    input: styles.input,
                    inputWithIcon: styles.inputWithIcon,
                    label: styles.label,
                  }}
                  iconComponent={
                    <IconButton
                      icon="times"
                      iconType="light"
                      className={styles.closeIcon}
                      onClick={() => {
                        this.props.change('patientInformation', 'customCarrier', false);
                        this.props.change(
                          'patientInformation',
                          'insuranceCarrier',
                          carriers[0].value,
                        );
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
                      bar: styles.bar,
                      caretIconWrapper: styles.caretIconWrapper,
                      error: styles.error,
                      erroredLabel: styles.erroredLabel,
                      erroredLabelFilled: styles.erroredLabelFilled,
                      errorIcon: styles.errorIcon,
                      errorToggleDiv: styles.erroredInput,
                      filled: styles.filled,
                      input: styles.input,
                      label: styles.label,
                      toggleDiv: styles.input,
                      wrapper: styles.wrapper,
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
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
                }}
                label="Insurance Member ID"
                name="insuranceMemberId"
              />
              <Field
                theme={{
                  bar: styles.bar,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  erroredLabel: styles.erroredLabel,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  filled: styles.filled,
                  group: styles.group,
                  iconClassName: styles.validationIcon,
                  input: styles.input,
                  inputWithIcon: styles.inputWithIcon,
                  label: styles.label,
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
      addNewFamilyPatient,
      change,
      fetchFamilyPatients,
      setFamilyPatientUser,
      setPatientUser,
      updateFamilyPatient,
    },
    dispatch,
  );
}

function mapStateToProps({ auth, availabilities, ...state }) {
  const selector = formValueSelector('patientInformation');
  const getPatientUser =
    availabilities.get('familyPatientUser') &&
    auth.get('familyPatients').length > 0 &&
    auth
      .get('familyPatients')
      .find(patient => patient.id === availabilities.get('familyPatientUser'));
  return {
    familyPatients: auth.get('familyPatients'),
    familyPatientUser: availabilities.get('familyPatientUser'),
    insuranceCarrierValue: selector(state, 'insuranceCarrier'),
    isCustomCarrier: selector(state, 'customCarrier'),
    isLoading: Array.isArray(auth.get('patientUser')),
    patientUser: getPatientUser,
    user: auth.get('patientUser'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientInformation));

PatientInformation.propTypes = {
  addNewFamilyPatient: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  familyPatients: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(patientUserShape)),
    PropTypes.instanceOf(List),
  ]).isRequired,
  familyPatientUser: PropTypes.string,
  fetchFamilyPatients: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  insuranceCarrierValue: PropTypes.string,
  isCustomCarrier: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  setFamilyPatientUser: PropTypes.func.isRequired,
  setPatientUser: PropTypes.func.isRequired,
  updateFamilyPatient: PropTypes.func.isRequired,
};

PatientInformation.defaultProps = {
  familyPatientUser: '',
  insuranceCarrierValue: carriers[0].value,
  isCustomCarrier: false,
  patientUser: false,
};
