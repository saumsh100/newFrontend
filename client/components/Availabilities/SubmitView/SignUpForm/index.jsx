
import React, { PropTypes } from 'react';
import { VButton, Form, Field } from '../../../library';
import { asyncValidatePatient, passwordsMatch, passwordStrength } from '../../../library/Form/validate';
import styles from './styles.scss';

export default function SignUpForm({ onSubmit }) {
  return (
    <Form
      form="userSignUpForm"
      onSubmit={onSubmit}
      validate={passwordsMatch}
      asyncValidate={asyncValidatePatient}
      asyncBlurFields={['email', 'phoneNumber']}
      ignoreSaveButton
    >
      <Field
        required
        name="firstName"
        label="First Name"
      />
      <Field
        required
        name="lastName"
        label="Last Name"
      />
      <Field
        required
        name="phoneNumber"
        label="Phone Number (+1)"
        type="tel"
      />
      <Field
        required
        label="Email"
        name="email"
        type="email"
      />
      <Field
        required
        label="Password"
        name="password"
        type="password"
        validate={[passwordStrength]}
      />
      <Field
        required
        label="Confirm Password"
        name="confirmPassword"
        type="password"
      />
      <VButton
        type="submit"
        className={styles.signup__footer_btn}
      >
        Sign Up and Book
      </VButton>
    </Form>
  );
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
