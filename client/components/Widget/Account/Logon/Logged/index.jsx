import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isPristine } from 'redux-form';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Form } from '../../../../library';
import { Button, Field } from '../../../components';
import { logout } from '../../../../../thunks/patientAuth';
import { refreshAvailabilitiesState } from '../../../../../reducers/availabilities';
import patientUserShape from '../../../../library/PropTypeShapes/patientUserShape';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import {
  asyncEmailValidatePatient,
  asyncPhoneNumberValidatePatient,
  composeAsyncValidators,
} from '../../../../library/Form/validate';
import { normalizePhone } from '../../../../library/Form/normalize';
import { updatePatient } from '../../../../../thunks/familyPatients';
import { inputTheme } from '../../../theme';
import styles from './styles.scss';

function Logged({ patientUser, location, history, pristine, ...props }) {
  const b = (path) =>
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
  const asyncEmailValidation = (values) =>
    values.email === props.patientUser.email ? false : asyncEmailValidatePatient(values);
  /**
   * Check if the passed phoneNumber is not already used,
   * but first check if the phoneNumber is not the same as the patient.
   *
   * @param {object} values
   */
  const asyncPhoneNumberValidation = (values) =>
    values.phoneNumber === props.patientUser.phoneNumber ||
    values.phoneNumber === normalizePhone(props.patientUser.phoneNumber)
      ? false
      : asyncPhoneNumberValidatePatient(values);

  const initialValues = patientUser && {
    firstName: patientUser.firstName,
    lastName: patientUser.lastName,
    phoneNumber: patientUser.phoneNumber,
    email: patientUser.email,
  };
  const handleUserUpdate = (values) => {
    try {
      props.updatePatient(values, patientUser.get('id'), patientUser.get('patientUserFamilyId'));
    } catch (err) {
      console.error('Error updating patient!', err);
    }
  };
  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>
            Hello, {patientUser ? patientUser.getFullName() : 'Guest'}!
          </h1>
          <p className={styles.description}>Manage and update your account information.</p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          {patientUser && (
            <Form
              ignoreSaveButton
              enableReinitialize
              form="loggedUserForm"
              onSubmit={handleUserUpdate}
              initialValues={initialValues}
              asyncValidate={composeAsyncValidators([
                asyncEmailValidation,
                asyncPhoneNumberValidation,
              ])}
              asyncBlurFields={['email', 'phoneNumber']}
            >
              <Field theme={inputTheme(styles)} required name="firstName" label="First Name" />
              <Field theme={inputTheme(styles)} required name="lastName" label="Last Name" />
              <Field
                theme={inputTheme(styles)}
                required
                name="phoneNumber"
                label="Mobile Number"
                type="tel"
              />
              <Field theme={inputTheme(styles)} required label="Email" name="email" type="email" />
              <div className={styles.buttonsWrapper}>
                <Button
                  onClick={() => {
                    if (
                      window.confirm(
                        'By signing out you will reset your current booking. Want to continue?',
                      )
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
                <Button type="submit" className={styles.actionButton} disabled={pristine}>
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
      updatePatient,
      refreshAvailabilitiesState,
    },
    dispatch,
  );
}
function mapStateToProps({ auth, ...state }) {
  return {
    pristine: isPristine('loggedUserForm')(state),
    patientUser: auth.get('patientUser'),
    isAuthenticated: auth.get('isAuthenticated'),
  };
}

Logged.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  patientUser: PropTypes.shape(patientUserShape).isRequired,
  logout: PropTypes.func.isRequired,
  updatePatient: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  refreshAvailabilitiesState: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logged));
