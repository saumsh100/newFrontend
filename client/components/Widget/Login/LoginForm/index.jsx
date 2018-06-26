
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../../../library';
import styles from './styles.scss';

const defaultSubmitButton = (
  <Button type="submit" negative fluid className={styles.button}>
    Sign In and Book
  </Button>
);

const LoginForm = ({
  onLogin,
  className,
  submitButton = defaultSubmitButton,
}) => (
  <Form
    form="patientLoginForm"
    onSubmit={onLogin}
    ignoreSaveButton
    className={className}
  >
    <Field required name="email" type="email" label="Email" />
    <Field required label="Password" name="password" type="password" />
    {submitButton}
  </Form>
);

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default LoginForm;
