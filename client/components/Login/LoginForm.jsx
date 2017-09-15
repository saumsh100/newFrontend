
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';
import FBLoginButton from '../library/FBLoginButton';

const defaultSubmitButton = (
  <Button
    type="submit"
    className={styles.signInSubmitButton}
  >
    Sign In
  </Button>
);

export default function Login({ onSubmit, submitButton = defaultSubmitButton, className }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton={true} className={className}>
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
      {submitButton}
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
