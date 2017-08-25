
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../library';
import styles from './styles.scss';

export default function ForgotPasswordForm({ onSubmit }) {
  return (
    <Form form="login" onSubmit={onSubmit} ignoreSaveButton={true}>
      <Field
        type="email"
        name="email"
        label="Email"
      />
      <Button
        type="submit"
        className={styles.signInSubmitButton}
      >
        Submit
      </Button>
    </Form>
  );
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
