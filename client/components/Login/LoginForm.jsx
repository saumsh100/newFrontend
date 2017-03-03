
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';

export default function Login({ onSubmit }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton={true}>
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
      <Button
        type="submit"
        style={{ width: '100%' }}
      >
        Sign In
      </Button>
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
