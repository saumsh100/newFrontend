
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';
import { Button, Field, Form } from '../../../../library';
import { logout } from '../../../../../thunks/patientAuth';
import { refreshAvailabilitiesState } from '../../../../../actions/availabilities';
import patientUserShape from '../../../../library/PropTypeShapes/patientUserShape';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import { composeAsyncValidators } from '../../../../library/Form/validate';
import { normalizePhone } from '../../../../library/Form/normalize';
import { updateFamilyPatient } from '../../../../../thunks/familyPatients';
import styles from './styles.scss';

function Logged({
  patientUser, location, history, ...props
}) {
  const b = path =>
    location.pathname
      .split('/')
      .filter((v, index) => index < 4)
      .concat(path)
      .join('/');
  /**
   * Check if the passed email is not already used,
   * but first check if the email is not the same as the patient.
   *
   * @param {object} values
   */
  const asyncEmailValidation = (values) => {
    if (!values.email || (patientUser && values.email === patientUser.email)) {
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
    if (
      !values.phoneNumber ||
      (patientUser && values.phoneNumber === patientUser.phoneNumber) ||
      (patientUser && values.phoneNumber === normalizePhone(patientUser.phoneNumber))
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
  const initialValues = patientUser && {
    firstName: patientUser.firstName,
    lastName: patientUser.lastName,
    phoneNumber: patientUser.phoneNumber,
    email: patientUser.email,
  };
  const handleUserUpdate = (values) => {
    try {
      props.updateFamilyPatient(values, patientUser.id);
    } catch (err) {
      console.error('Error updating patient!', err);
    }
  };
  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>
            Hello, {patientUser ? `${patientUser.firstName} ${patientUser.lastName}` : 'Guest'}!
          </h1>
          <p className={styles.description}>Manage and update your account information.</p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {patientUser && (
            <Form
              ignoreSaveButton
              form="loggedUserForm"
              onSubmit={handleUserUpdate}
              initialValues={initialValues}
              asyncValidate={composeAsyncValidators([
                asyncEmailValidation,
                asyncPhoneNumberValidation,
              ])}
              asyncBlurFields={['email', 'phoneNumber']}
            >
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
                required
                name="phoneNumber"
                label="Mobile Number"
                type="tel"
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
                label="Email"
                name="email"
                type="email"
              />
              <div className={styles.buttonsWrapper}>
                <Button
                  onClick={() => {
                    if (
                      window.confirm('By signing out you will reset your current booking. Want to continue?')
                    ) {
                      props.refreshAvailabilitiesState();
                      props.logout();
                      history.push(b('book'));
                    }
                  }}
                  className={classNames(styles.subCardLinkDanger)}
                >
                  Sign Out
                </Button>
                <Button type="submit" className={styles.actionButton}>
                  Update Account
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout,
      updateFamilyPatient,
      refreshAvailabilitiesState,
    },
    dispatch,
  );
}
function mapStateToProps({ auth }) {
  return {
    patientUser: auth.get('patientUser'),
    isAuthenticated: auth.get('isAuthenticated'),
  };
}

Logged.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
  logout: PropTypes.func.isRequired,
  updateFamilyPatient: PropTypes.func.isRequired,
  refreshAvailabilitiesState: PropTypes.func.isRequired,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Logged));
