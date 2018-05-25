
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Field } from '../../../library';
import {
  composeAsyncValidators,
  normalizeBirthdate,
  validateBirthdate,
  emailValidate,
} from '../../../library/Form/validate';
import { normalizePhone } from '../../../library/Form/normalize';
import { fetchFamilyPatients } from '../../../../thunks/familyPatients';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import styles from './styles.scss';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';

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

class EditPatient extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Fetches the patients on the family,
   * to compare the uid on the URL with the UIDs
   * on the fetched data, if we don't match any UID,
   * redirect the user back to the Review & Book page.
   */
  componentWillMount() {
    return this.props.fetchFamilyPatients().then(() => {
      if (!this.props.patientUser) {
        this.props.history.push('../../book/additional-information');
      }
    });
  }

  /**
   * Updates a patientUser.
   *
   * @param values
   */
  async handleSubmit(values) {
    const { user } = this.props;
    try {
      await axios.put(
        `/families/${user.patientUserFamilyId}/patients/${this.props.match.params.patientId}`,
        values
      );
      await this.props.fetchFamilyPatients();
    } catch (err) {
      console.log('Error updating patient!', err);
    }

    return this.props.history.push({
      pathname: '../../book/additional-information',
    });
  }

  render() {
    /**
     * Check if the passed email is not already used,
     * but first check if the email is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncEmailValidation = (values) => {
      if (!values.email || values.email === this.props.formValues.initial.email) {
        return null;
      }
      return axios.post('/patientUsers/email', { email: values.email }).then((response) => {
        if (response.data.exists) {
          return Promise.reject({ email: 'There is already a user with that email' });
        }
        return null;
      });
    };
    /**
     * Check if the passed phoneNumber is not already used,
     * but first check if the phoneNumber is not the same as the patient.
     *
     * @param {object} values
     */
    const asyncPhoneNumberValidation = (values) => {
      if (
        !values.phoneNumber ||
        values.phoneNumber === this.props.formValues.values.phoneNumber ||
        values.phoneNumber === normalizePhone(this.props.formValues.values.phoneNumber)
      ) {
        return null;
      }
      return axios
        .post('/patientUsers/phoneNumber', { phoneNumber: values.phoneNumber })
        .then((response) => {
          const { error } = response.data;
          if (error) {
            return Promise.reject({ phoneNumber: error });
          }
          return null;
        });
    };

    const { birthDate } = this.props.patientUser;

    const initialValues = this.props.patientUser;
    initialValues.birthDate = birthDate ? moment(birthDate).format('MM/DD/YYYY') : null;

    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3 className={styles.title}>New Patient</h3>
            <p className={styles.subtitle}>
              Add family members and leave any necessary notes for the practice.
            </p>
            <Form
              ignoreSaveButton
              form="editFamilyPatient"
              onSubmit={this.handleSubmit}
              initialValues={initialValues}
              asyncValidate={composeAsyncValidators([
                asyncEmailValidation,
                asyncPhoneNumberValidation,
              ])}
              asyncBlurFields={['email', 'phoneNumber', 'birthDate']}
            >
              <Field
                theme={{
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
                label="First Name *"
              />
              <Field
                theme={{
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
                label="Last Name *"
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
                  validateValue={value => validateField(genders, value) || value === null}
                  renderValue={value =>
                    (validateField(genders, value) && validateField(genders, value).label) || ''
                  }
                  options={genders}
                  data-test-id="gender"
                />
              </div>
              <Field
                theme={{
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
                normalize={normalizeBirthdate}
                validate={[validateBirthdate]}
                name="birthDate"
                label="Birth Date (MM/DD/YYYY)"
              />
              <Field
                theme={{
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                name="phoneNumber"
                label="Mobile Number"
                type="tel"
              />
              <Field
                theme={{
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                label="Email"
                name="email"
                validate={[emailValidate]}
              />
              <div className={styles.submitButtonWrapper}>
                <Button type="submit" className={styles.actionButton}>
                  Continue
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

EditPatient.propTypes = {
  fetchFamilyPatients: PropTypes.func,
  formValues: PropTypes.objectOf(PropTypes.string),
  history: PropTypes.shape(historyShape),
  patientUser: PropTypes.shape({
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
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  user: PropTypes.shape({
    id: PropTypes.string,
    gender: PropTypes.any,
    email: PropTypes.string,
    birthDate: PropTypes.any,
    deletedAt: PropTypes.any,
    avatarUrl: PropTypes.any,
    lastName: PropTypes.string,
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    phoneNumber: PropTypes.string,
    isEmailConfirmed: PropTypes.bool,
    patientUserFamilyId: PropTypes.string,
    isPhoneNumberConfirmed: PropTypes.bool,
  }),
};

function mapStateToProps({ auth, form }, { match }) {
  return {
    formValues: form.editFamilyPatient,
    user: auth.get('patientUser'),
    patientUser: auth.get('familyPatients').find(patient => patient.id === match.params.patientId),
    familyPatients: auth.get('familyPatients'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchFamilyPatients,
    },
    dispatch
  );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPatient));
