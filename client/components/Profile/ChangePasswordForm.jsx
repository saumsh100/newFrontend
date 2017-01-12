
import React, { PropTypes } from 'react';
import zxcvbn from 'zxcvbn';
import { Form, Field, Button } from '../library';

const validate = ({ password, confirmPassword }) => {
  const errors = {};
  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = 'Password does not match';
  }
  
  return errors;
};

const passwordStrength = (value) => {
  if (!value) return;
  
  const result = zxcvbn(value);
  const { score, feedback: { warning } } = result;
  if (score < 2) {
    return warning || 'New password not strong enough';
  }
};

export default function ChangePasswordForm({ onSubmit }) {
  return (
    <Form form="changePassword" onSubmit={onSubmit} validate={validate} >
      <Field
        required
        type="password"
        name="oldPassword"
        label="Current Password"
      />
      <Field
        required
        type="password"
        name="password"
        label="New Password"
        validate={[passwordStrength]}
      />
      <Field
        required
        type="password"
        name="confirmPassword"
        label="Confirm Password"
      />
      <Button
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
