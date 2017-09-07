
import React, { PropTypes } from 'react';
import { Button, Form, Field } from '../../library';
import { passwordsValidate, passwordStrength } from '../../library/Form/validate';


export default function ResetPasswordForm({ onSubmit }) {
  return (
    <Form
      form="login"
      onSubmit={onSubmit}
      ignoreSaveButton
    >
      <Field
        required
        type="password"
        name="password"
        validate={[passwordsValidate, passwordStrength]}
        label="New Password"
      />
      <Field
        required
        type="password"
        name="confirmPassword"
        validate={[passwordsValidate, passwordStrength]}
        label="Confirm Password"
      />
      <Button
        type="submit"
        style={{ width: '100%' }}
      >
        Reset Password
      </Button>
    </Form>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
