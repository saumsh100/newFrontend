
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../../../library';
import { validate, asyncEmailValidate } from '../../../library/Form/validate';
import styles from './styles.scss';

export default function SignUpForm({ onSubmit }) {
  return (
    <Form
      form="userSignUpForm"
      onSubmit={onSubmit}
      validate={validate}
      asyncValidate={asyncEmailValidate}
      asyncBlurFields={['email']}
      ignoreSaveButton
    >
      <div>
        <Field
          name="firstName"
          label="First Name*"
        />
        <Field
          name="lastName"
          label="Last Name*"
        />
      </div>
      <Field
        label="Phone Number*"
        name="phone"
      />
      <Field
        label="Email*"
        name="email"
        type="email"
      />
      <Field
        label="Password*"
        name="password"
      />
      <Field
        label="Confirm Password*"
        name="confirmPassword"
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
