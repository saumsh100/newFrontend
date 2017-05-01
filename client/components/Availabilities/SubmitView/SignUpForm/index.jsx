
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../../../library';
import { validate, asyncEmailValidate } from '../../../library/Form/validate';
import styles from './styles.scss';

export default function SignUpForm({ onSubmit }) {
  return (
    <Form
      form="userSignUpForm"
      onSubmit={onSubmit}
      asyncValidate={asyncEmailValidate}
      asyncBlurFields={['email']}
      ignoreSaveButton
    >
      <div>
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
      </div>
      <Field
        required
        label="Phone Number"
        name="phone"
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
      />
      <Field
        required
        label="Confirm Password"
        name="confirmPassword"
        type="password"
      />
      <Button
        type="submit"
        className={styles.signup__footer_btn}
      >
        Book an appointment
      </Button>
    </Form>
  );
}

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
