import React, { PropTypes } from 'react';
import { VButton, Form, Field } from '../../../library';

const LoginForm = ({ onLogin, className }) => (
  <Form
    form="patientLoginForm"
    onSubmit={onLogin}
    ignoreSaveButton
    className={className}
  >
    <Field
      required
      name="email"
      type="email"
      label="Email"
    />
    <Field
      required
      label="Password"
      name="password"
      type="password"
    />

    <VButton type="submit" upperCase negative fluid>
      SIGN IN
    </VButton>
  </Form>
);

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default LoginForm;
