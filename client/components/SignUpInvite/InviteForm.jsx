
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import { maxLength, asyncEmailValidateUser, emailValidate, passwordsValidate } from '../library/Form/validate';


export default function Invite({ onSubmit }) {
  return (
    <Form form="login"
      onSubmit={onSubmit}
      ignoreSaveButton={true}
      asyncValidate={asyncEmailValidateUser}
      asyncBlurFields={['email']}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(15)]}
        label="Last Name"
      />
      <Field
        required
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
      />
      <Field
        required
        type="password"
        name="password"
        validate={[passwordsValidate]}
        label="Password"
      />
      <Field
        required
        type="password"
        name="confirmPassword"
        validate={[passwordsValidate]}
        label="Password Confirmation"
      />
      <Button
        type="submit"
        style={{ width: '100%' }}
      >
        Sign Up
      </Button>
    </Form>
  );
}

Invite.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
