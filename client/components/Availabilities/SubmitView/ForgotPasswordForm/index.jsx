import React, { PropTypes } from 'react';
import { Button, Form, Field, VButton } from '../../../library';
import styles from '../styles.scss';
import { emailValidate, asyncEmailPasswordReset } from '../../../library/Form/validate';

export default function ForgotPasswordForm({ onSubmit, className, setIsLogin, setForgotPassword }) {
  return (
    <Form
      form="forgotPassword"
      onSubmit={onSubmit}
      ignoreSaveButton
      className={className}
    >
      <Field
        type="email"
        name="email"
        label="Email"
        validate={[emailValidate]}
      />
      <Button
        className={styles.exitButton}
      >
        Reset your password
      </Button>
      <a
        href="#backtoLogin"
        onClick={()=> {
          setForgotPassword(false);
          setIsLogin(true);
        }}
        className={styles.backToLogin}
      >
        Back to Login
      </a>
    </Form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};
