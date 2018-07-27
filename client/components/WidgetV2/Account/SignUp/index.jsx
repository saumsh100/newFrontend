
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  asyncValidatePatient,
  passwordsMatch,
  passwordStrength,
} from '../../../library/Form/validate';
import { Link, Form, Field, Button } from '../../../library';
import { createPatient } from '../../../../thunks/patientAuth';
import styles from './styles.scss';

function SignUp(props) {
  const handleSignUp = values => props.createPatient(values);

  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Sign Up</h1>
          <p className={styles.description}>
            Fill your data to finish your booking.<br /> Already have an account?{' '}
            <Link className={styles.subCardLink} to="./login">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <Form
              ignoreSaveButton
              form="userSignUpForm"
              onSubmit={handleSignUp}
              validate={passwordsMatch}
              asyncValidate={asyncValidatePatient}
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
                label="Password"
                name="password"
                type="password"
                validate={[passwordStrength]}
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
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
              <Button type="submit" className={styles.actionButton}>
                Sign Up
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createPatient,
    },
    dispatch,
  );
}

SignUp.propTypes = {
  createPatient: PropTypes.func.isRequired,
};

export default withRouter(connect(
  null,
  mapDispatchToProps,
)(SignUp));
