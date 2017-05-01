
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';

export default function Invite({ onSubmit }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton={true}>
      <Field
        name="firstName"
        label="First Name"
      />
      <Field
        name="lastName"
        label="Last Name"
      />
      <Field
        type="email"
        name="email"
        label="Email"
      />
      <Field
        type="password"
        name="password"
        label="Password"
      />
      <Field
        type="password"
        name="passwordConfirmation"
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
