
import React, { PropTypes } from 'react';
import { Button, Form, Field, VButton } from '../../library';
import { emailValidate } from '../../library/Form/validate';

const defaultSubmitButton = <Button type="submit">Reset your password</Button>;

export default function ResetPasswordForm({
  onSubmit,
  className,
  submitButton = defaultSubmitButton,
}) {
  return (
    <Form
      form="patientResetPassword"
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
      {submitButton}
    </Form>
  );
}

ResetPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};
