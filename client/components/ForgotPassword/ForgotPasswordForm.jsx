
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';
import { emailValidate, asyncEmailPasswordReset } from '../library/Form/validate';

export default function ForgotPasswordForm({ onSubmit }) {
  return (
    <Form
      form="forgotPassword"
      asyncValidate={asyncEmailPasswordReset}
      onSubmit={onSubmit}
      ignoreSaveButton
    >
      <Field
        type="email"
        name="email"
        label="Email"
        validate={[emailValidate]}
      />
      <Button
        type="submit"
        className={styles.submitButton}
      >
        Reset Password
      </Button>
    </Form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
