
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { Button, Form, Field } from '../../../library';
import { setFamilyPatientUser } from '../../../../actions/availabilities';
import {
  asyncValidatePatient,
  normalizeBirthdate,
  validateBirthdate,
  emailValidate,
} from '../../../library/Form/validate';
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

class AddPatient extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Send a post request in order to
   * add a patientUser to a patientUserFamily,
   * after that push back to the review page.
   *
   * @param {array} values
   */
  handleSubmit(values) {
    const { patientUserFamilyId } = this.props;
    return axios
      .post(`/families/${patientUserFamilyId}/patients`, values)
      .then(response => this.props.setFamilyPatientUser(response.data.id))
      .then(() => this.props.history.goBack({ pathname: '../book/additional-information' }));
  }

  render() {
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
              form="addFamilyPatient"
              onSubmit={this.handleSubmit}
              asyncValidate={asyncValidatePatient}
              asyncBlurFields={['email', 'phoneNumber']}
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

AddPatient.propTypes = {
  history: PropTypes.shape(historyShape),
  patientUserFamilyId: PropTypes.string,
  setFamilyPatientUser: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setFamilyPatientUser,
    },
    dispatch
  );
}

function mapStateToProps({ auth }) {
  return {
    patientUserFamilyId: auth.get('patientUser').get('patientUserFamilyId'),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddPatient));
