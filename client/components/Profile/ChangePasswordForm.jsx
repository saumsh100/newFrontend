
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../library';
import { passwordsMatch, passwordStrength } from '../library/Form/validate';

export default function ChangePasswordForm({ onSubmit }) {
  return (
    <Form form="changePassword" onSubmit={onSubmit} validate={passwordsMatch}>
      <Field required type="password" name="oldPassword" label="Current Password" />
      <Field
        required
        type="password"
        name="password"
        label="New Password"
        validate={[passwordStrength]}
      />
      <Field required type="password" name="confirmPassword" label="Confirm Password" />
    </Form>
  );
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
