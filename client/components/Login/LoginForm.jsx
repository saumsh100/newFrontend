
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';
import FBLoginButton from '../library/FBLoginButton';

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
        className={styles.signInSubmitButton}
      >
        Sign In
      </Button>
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
