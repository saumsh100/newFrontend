
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';
import FBLoginButton from '../library/FBLoginButton';

const defaultSubmitButton = (
  <Button type="submit" className={styles.signInSubmitButton}>
    Sign In
  </Button>
);

export default function Login({
  onSubmit,
  submitButton = defaultSubmitButton,
  className,
}) {
  return (
    <Form
      form="login"
      onSubmit={onSubmit}
      ignoreSaveButton
      className={className}
    >
      <Field type="email" name="email" label="Email" required />
      <Field type="password" name="password" label="Password" required />
      {submitButton}
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
