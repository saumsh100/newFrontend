import React, { PureComponent } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import trim from 'lodash/trim';
import { Element, scroller } from 'react-scroll';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { change, formValueSelector, submit, touch } from 'redux-form';
import classNames from 'classnames';
import { logout } from '../../../../thunks/patientAuth';
import carriers from './insurance_carriers';
import { Form, IconButton, Loading } from '../../../library';
import { Field } from '../../components';
import {
  addNewFamilyPatient,
  fetchFamilyPatients,
  updatePatient,
} from '../../../../thunks/familyPatients';
import {
  asyncEmailValidatePatient,
  asyncPhoneNumberValidatePatient,
  composeAsyncValidators,
  emailValidate,
  normalizeBirthdate,
  validateBirthdate,
} from '../../../library/Form/validate';
import { normalizePhone } from '../../../library/Form/normalize';
import EnabledFeature from '../../../library/EnabledFeature';
import { SortByFirstName } from '../../../library/util/SortEntities';
import { setFamilyPatientUser, setPatientUser } from '../../../../reducers/availabilities';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import { historyShape, locationShape } from '../../../library/PropTypeShapes/routerShapes';
import patientUserShape from '../../../library/PropTypeShapes/patientUserShape';
import {
  hideButton,
  setIsClicked,
  setText,
  showButton,
} from '../../../../reducers/widgetNavigation';
import { dropdownTheme, inputTheme } from '../../theme';
import Button from '../../components/Button';
import styles from './styles.scss';

/**
 * Gender's array
 */
const genders = [
  {
    value: 'male',
    label: 'Male',
  },
  {
    value: 'female',
    label: 'Female',
  },
];
/**
 * With the provided object get the first key
 * @param erroWrapper
 * @returns {string|undefined}
 */
const getError = (erroWrapper) =>
  erroWrapper && Object.keys(erroWrapper).length > 0 && Object.keys(erroWrapper)[0];

const NEW_PATIENT = 'new';
const FORM_NAME = 'patientInformation';

/**
 * Find the first option that matches the passed string.
 *
 * @param {{label, value}} data
 * @param {string} value
 */
const validateField = (data, value) => data.find((item) => item.value === value);

const defaultValues = {
  birthDate: '',
  email: '',
  firstName: '',
  gender: '',
  insuranceCarrier: carriers[0].value,
  insuranceGroupId: '',
  insuranceMemberId: '',
  lastName: '',
  patientUser: 'new',
  phoneNumber: '',
};

class PatientInformation extends PureComponent {
  constructor(props) {
    super(props);

    this.handleFormChanges = this.handleFormChanges.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.handlePatientChanges = this.handlePatientChanges.bind(this);
    this.verifyEmailIfPatientIsNotTheUser = this.verifyEmailIfPatientIsNotTheUser.bind(this);
  }

  componentDidMount() {
    this.props.setText();
    this.props.fetchFamilyPatients();
    this.props.setFamilyPatientUser(this.props.selectedFamilyPatientUserId);
    this.props.touch(FORM_NAME, ...Object.keys(defaultValues));
    if (this.props.formError) {
      this.props.hideButton();
    } else {
      this.props.showButton();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isCustomCarrier && this.props.insuranceCarrierValue === carriers[1].value) {
      this.props.change(FORM_NAME, 'insuranceCarrier', '');
    }

    if (this.props.formError) {
      this.props.hideButton();
    } else {
      this.props.showButton();
    }
    if (!prevProps.floatingButtonIsClicked && this.props.floatingButtonIsClicked) {
      if (this.props.formError) {
        this.props.touch(FORM_NAME, ...Object.keys(defaultValues));
        return this.scrollTo(this.props.formError);
      }
      this.props.setIsClicked(false);
      this.props.setText();
      return this.props.submit(FORM_NAME);
    }

    return undefined;
  }

  /**
   *
   * @param {*} _
   * @param {string} patientId
   */
  handlePatientChanges(_, patientId) {
    return this.props.setFamilyPatientUser(patientId);
  }

  /**
   * Check if the user is changing the form,
   * but did not select any patient yet set the patientUser to a new-one.
   *
   * @param {object} values
   */
  handleFormChanges(values) {
    // clear insuranceMemberId, insuranceGroupId
    // if insurance carrier is "Pay for myself"
    const { insuranceCarrier } = values;
    if (insuranceCarrier === 'Pay for myself') {
      this.props.change(FORM_NAME, 'insuranceGroupId', null);
      this.props.change(FORM_NAME, 'insuranceMemberId', null);
    }

    if (values && !values.patientUser) {
      this.props.change(FORM_NAME, 'patientUser', NEW_PATIENT);
    }
  }

  async updateUserProfile(values) {
    const { selectedFamilyPatientUserId, location } = this.props;

    /**
     * Checks if there are a specific route to go onclicking a card or just the default one.
     */
    const contextualUrl =
      (location.state && location.state.nextRoute) || './additional-information';

    /**
     * If the patientUser is new, let's create a new family member.
     */
    const sanitizedValues = {
      ...values,
      firstName: trim(values.firstName),
      lastName: trim(values.lastName),
      email: !values.email ? null : values.email,
    };

    if (selectedFamilyPatientUserId === NEW_PATIENT) {
      try {
        this.props.addNewFamilyPatient(sanitizedValues);
        return this.props.history.push(contextualUrl);
      } catch (err) {
        console.error('Error creating patient!', err);
      }
    } else {
      try {
        await this.props.updatePatient(sanitizedValues, selectedFamilyPatientUserId);
        return this.props.history.push(contextualUrl);
      } catch (err) {
        console.error('Error updating patient!', err);
      }
    }
    return false;
  }

  scrollTo(name) {
    scroller.scrollTo(name, {
      duration: 500,
      delay: 150,
      offset: -110,
      smooth: 'easeInOutQuart',
      containerId: 'contentWrapperToScroll',
    });
  }

  verifyEmailIfPatientIsNotTheUser(value) {
    return !value && this.props.patientIsUser && 'Email required for primary account owner';
  }

  render() {
    const {
      isCustomCarrier,
      familyPatients,
      isLoading,
      patientUser,
      history,
      userName,
      initialValues,
      patientIsUser,
      insuranceCarrierValue,
    } = this.props;

    /**
     * Wait until we fetch the family patients.
     */
    if (isLoading) {
      return <Loading />;
    }

    const patients = familyPatients
      .sort(SortByFirstName)
      .map((patient) => ({
        value: patient.id,
        label: `${patient.firstName} ${patient.lastName}`,
      }))
      .push({
        value: NEW_PATIENT,
        label: 'Someone Else',
      })
      .toJS();

    /**
     * Check if the passed email is not already used,
     * but first check if the email is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncEmailValidation = (values) =>
      patientIsUser &&
      patientUser &&
      patientUser.email &&
      (values.email === patientUser.email ? false : asyncEmailValidatePatient(values));
    /**
     * Check if the passed phoneNumber is not already used,
     * but first check if the phoneNumber is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncPhoneNumberValidation = (values) => {
      if (
        !patientIsUser &&
        this.props.familyPatients
          .toJS()
          .find(
            ({ phoneNumber }) =>
              phoneNumber &&
              (phoneNumber === values.phoneNumber ||
                values.phoneNumber === normalizePhone(phoneNumber)),
          )
      ) {
        const error = {
          phoneNumber:
            'Phone number already used by a family member. Please use unique phone number or leave blank',
        };
        throw error;
      }
      return patientIsUser &&
        patientUser &&
        patientUser.phoneNumber &&
        (values.phoneNumber === patientUser.phoneNumber ||
          values.phoneNumber === normalizePhone(patientUser.phoneNumber))
        ? false
        : asyncPhoneNumberValidatePatient(values);
    };

    const onSignOut = () => {
      if (window.confirm('Are you sure you want to log out?')) {
        this.props.logout();
        history.push('../login');
      }
    };
    return (
      <Element id="contentWrapperToScroll" className={styles.scrollableContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Who is this appointment for?</h1>
            <p className={styles.description}>
              Are you not {userName}?{' '}
              <Button onClick={onSignOut} className={classNames(styles.subCardLinkDanger)}>
                Logout
              </Button>
            </p>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Form
            ignoreSaveButton
            enableReinitialize
            form={FORM_NAME}
            initialValues={initialValues}
            onChange={this.handleFormChanges}
            onSubmit={this.updateUserProfile}
            asyncValidate={composeAsyncValidators([
              asyncEmailValidation,
              asyncPhoneNumberValidation,
            ])}
            asyncBlurFields={['email', 'phoneNumber']}
          >
            <div className={styles.container}>
              <Element name="patientUser" className={styles.elementWrapper}>
                <div className={styles.group}>
                  <Field
                    name="patientUser"
                    label="Select Patient"
                    component={SuggestionSelect}
                    onChange={this.handlePatientChanges}
                    required
                    className={styles.ddMenu}
                    theme={dropdownTheme(styles)}
                    validateValue={(value) => validateField(patients, value) || value === null}
                    renderValue={(value) =>
                      value === 'Someone Else' || value === ''
                        ? value
                        : patients.find((patient) => patient.value === value).label
                    }
                    options={patients}
                    data-test-id="gender"
                  />
                </div>
              </Element>
              <Element name="firstName" className={styles.elementWrapper}>
                <Field theme={inputTheme(styles)} required name="firstName" label="First Name *" />
              </Element>
              <Element name="lastName" className={styles.elementWrapper}>
                <Field theme={inputTheme(styles)} required name="lastName" label="Last Name *" />
              </Element>
              {patientIsUser && (
                <Element name="email" className={styles.elementWrapper}>
                  <Field
                    theme={inputTheme(styles)}
                    label={`Email ${patientIsUser ? '*' : ''}`}
                    name="email"
                    type="email"
                    required={patientIsUser}
                    validate={[emailValidate, this.verifyEmailIfPatientIsNotTheUser]}
                  />
                </Element>
              )}
              <Element name="birthDate" className={styles.elementWrapper}>
                <Field
                  theme={inputTheme(styles)}
                  required
                  normalize={normalizeBirthdate}
                  validate={[validateBirthdate]}
                  name="birthDate"
                  label="Birth Date *"
                />
              </Element>
              <Element name="phoneNumber" className={styles.elementWrapper}>
                <Field
                  theme={inputTheme(styles)}
                  required={patientIsUser}
                  name="phoneNumber"
                  type="tel"
                  label={
                    patientIsUser
                      ? 'Phone Number *'
                      : 'Family Member Phone Number (leave blank if none)'
                  }
                />
              </Element>
              <Element name="gender" className={styles.elementWrapper}>
                <div className={styles.group}>
                  <Field
                    name="gender"
                    label="Gender"
                    component={SuggestionSelect}
                    theme={dropdownTheme(styles)}
                    validateValue={(value) => validateField(genders, value)}
                    renderValue={(value) =>
                      (validateField(genders, value) && validateField(genders, value).label) || ''
                    }
                    options={genders}
                    data-test-id="gender"
                  />
                </div>
              </Element>
              <EnabledFeature
                predicate={({ flags }) => flags.get('booking-widget-insurance')}
                render={() => (
                  <div className={styles.group}>
                    <Element name="insuranceCarrier" className={styles.elementWrapper}>
                      {isCustomCarrier ? (
                        <Field
                          autoFocus={
                            insuranceCarrierValue &&
                            initialValues.insuranceCarrier !== insuranceCarrierValue
                          }
                          theme={inputTheme(styles)}
                          iconComponent={
                            <IconButton
                              icon="times"
                              iconType="light"
                              className={styles.closeIcon}
                              onClick={() =>
                                this.props.change(FORM_NAME, 'insuranceCarrier', carriers[0].value)
                              }
                            />
                          }
                          required
                          name="insuranceCarrier"
                          label="Insurance Carrier *"
                        />
                      ) : (
                        <div className={styles.group}>
                          <Field
                            name="insuranceCarrier"
                            label="Insurance Carrier *"
                            component={SuggestionSelect}
                            theme={dropdownTheme(styles)}
                            required
                            validateValue={(value) =>
                              validateField(carriers, value) || value === null
                            }
                            renderValue={(value) =>
                              (validateField(carriers, value) &&
                                validateField(carriers, value).label) ||
                              ''
                            }
                            options={carriers}
                            data-test-id="insuranceCarrier"
                          />
                        </div>
                      )}
                    </Element>
                    <Element name="insuranceMemberId" className={styles.elementWrapper}>
                      <Field
                        theme={inputTheme(styles)}
                        label="Insurance Member ID"
                        name="insuranceMemberId"
                        disabled={insuranceCarrierValue === carriers[0].value}
                      />
                    </Element>
                    <Element name="insuranceGroupId" className={styles.elementWrapper}>
                      <Field
                        theme={inputTheme(styles)}
                        label="Group ID"
                        name="insuranceGroupId"
                        disabled={insuranceCarrierValue === carriers[0].value}
                      />
                    </Element>
                  </div>
                )}
              />
            </div>
          </Form>
        </div>
      </Element>
    );
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addNewFamilyPatient,
      change,
      submit,
      fetchFamilyPatients,
      setFamilyPatientUser,
      setPatientUser,
      updatePatient,
      logout,
      touch,
      showButton,
      hideButton,
      setIsClicked,
      setText,
    },
    dispatch,
  );

const mapStateToProps = ({ auth, availabilities, widgetNavigation, ...state }) => {
  const selector = formValueSelector(FORM_NAME);
  const patientInfoForm = state.form[FORM_NAME];
  const familyPatients = auth.get('familyPatients');

  const patientId = availabilities.get('familyPatientUser') || auth.get('patientUser').get('id');
  const patientIndex = familyPatients.findIndex((i) => i.id === patientId);
  const patientUser = patientIndex > -1 ? auth.getIn(['familyPatients', patientIndex]) : false;
  const initialValues = patientUser
    ? {
        ...defaultValues,
        ...patientUser.toJS(),
        birthDate: patientUser.getBirthDate(),
        patientUser: patientId,
        insuranceCarrier: patientUser.insuranceCarrier || carriers[0].value,
      }
    : defaultValues;
  return {
    familyPatients,
    selectedFamilyPatientUserId: patientId,
    initialValues,
    insuranceCarrierValue: selector(state, 'insuranceCarrier'),
    patientIsUser: availabilities.get('familyPatientUser') === auth.get('patientUser').get('id'),
    formError:
      patientInfoForm && (patientInfoForm.syncErrors || patientInfoForm.asyncErrors)
        ? getError(patientInfoForm.syncErrors) || getError(patientInfoForm.asyncErrors)
        : '',
    isCustomCarrier:
      patientInfoForm &&
      !carriers.find((carrier) => carrier.label === selector(state, 'insuranceCarrier')),
    isLoading: familyPatients.size === 0,
    patientUser,
    userName: auth.get('patientUser').getFullName(),
    floatingButtonIsClicked: widgetNavigation.getIn(['floatingButton', 'isClicked']),
  };
};

PatientInformation.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  initialValues: PropTypes.shape({
    birthDate: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    gender: PropTypes.string,
    insuranceCarrier: PropTypes.string,
    insuranceGroupId: PropTypes.string,
    insuranceMemberId: PropTypes.string,
    lastName: PropTypes.string,
    patientUser: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  logout: PropTypes.func.isRequired,
  addNewFamilyPatient: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  touch: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  familyPatients: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(patientUserShape)),
    PropTypes.instanceOf(List),
  ]).isRequired,
  selectedFamilyPatientUserId: PropTypes.string,
  fetchFamilyPatients: PropTypes.func.isRequired,
  formError: PropTypes.string.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isCustomCarrier: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.bool]),
  setFamilyPatientUser: PropTypes.func.isRequired,
  updatePatient: PropTypes.func.isRequired,
  floatingButtonIsClicked: PropTypes.bool.isRequired,
  setIsClicked: PropTypes.func.isRequired,
  showButton: PropTypes.func.isRequired,
  hideButton: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
  insuranceCarrierValue: PropTypes.string,
  userName: PropTypes.string.isRequired,
  patientIsUser: PropTypes.bool.isRequired,
};

PatientInformation.defaultProps = {
  initialValues: defaultValues,
  selectedFamilyPatientUserId: '',
  isCustomCarrier: false,
  insuranceCarrierValue: '',
  patientUser: false,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PatientInformation));
