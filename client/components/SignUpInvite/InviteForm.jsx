
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import { validate, asyncEmailValidateUser } from '../library/Form/validate';


export default function Invite({ onSubmit }) {
  return (
    <Form form="login"
          onSubmit={onSubmit}
          ignoreSaveButton={true}
          validate={validate}
          asyncValidate={asyncEmailValidateUser}
          asyncBlurFields={['email']}
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
        type="email"
        name="email"
        label="Email"
      />
      <Field
        required
        type="password"
        name="password"
        label="Password"
      />
      <Field
        required
        type="password"
        name="confirmPassword"
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
