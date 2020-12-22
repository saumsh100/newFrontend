
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import trim from 'lodash/trim';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  asyncValidatePatient,
  passwordsMatch,
  passwordStrength,
} from '../../../library/Form/validate';
import { Link, Form, Field, Button } from '../../../library';
import { createPatient } from '../../../../thunks/patientAuth';
import { inputTheme } from '../../theme';
import styles from './styles.scss';

function SignUp(props) {
  const handleSignUp = (values) => {
    props.createPatient({
      ...values,
      firstName: trim(values.firstName),
      lastName: trim(values.lastName),
    });
  };

  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Sign Up</h1>
          <p className={styles.description}>
            Fill your data to finish your booking.
            <br /> Already have an account?{' '}
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
              <Field
                theme={inputTheme(styles)}
                required
                label="Password"
                name="password"
                type="password"
                validate={[passwordStrength]}
              />
              <Field
                theme={inputTheme(styles)}
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

export default withRouter(
  connect(
    null,
    mapDispatchToProps,
  )(SignUp),
);
