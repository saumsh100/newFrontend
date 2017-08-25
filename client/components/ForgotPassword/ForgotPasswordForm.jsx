
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';

export default function ForgotPasswordForm({ onSubmit }) {
  return (
    <Form form="forgotPassword" onSubmit={onSubmit} ignoreSaveButton={true}>
      <Field
        type="email"
        name="email"
        label="Email"
      />
      <Button
        type="submit"
        className={styles.submitButton}
      >
        Recover Password
      </Button>
    </Form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
