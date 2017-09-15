import React, { PropTypes } from 'react';
import { Button, Form, Field, VButton } from '../../../library';
import styles from '../styles.scss';
import { emailValidate, asyncEmailPasswordReset } from '../../../library/Form/validate';

export default function ForgotPasswordForm({ onSubmit, className }) {
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
      <VButton
        className={styles.exitButton}
      >
        Reset your password
      </VButton>
    </Form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
