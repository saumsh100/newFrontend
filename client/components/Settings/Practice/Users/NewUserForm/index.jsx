
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form } from '../../../../library';
import {
  asyncEmailValidateUser,
  emailValidate,
  maxLength,
  passwordStrength,
  passwordsValidate,
} from '../../../../library/Form/validate';

const NewUserForm = ({ sendNewUser, formName, formStyle }) => (
  <Form
    className={formStyle}
    form={formName}
    onSubmit={sendNewUser}
    asyncValidate={asyncEmailValidateUser}
    ignoreSaveButton
  >
    <Field required validate={[maxLength(25)]} name="firstName" label="First Name" />
    <Field required validate={[maxLength(25)]} name="lastName" label="Last Name" />
    <Field required validate={[emailValidate]} type="email" name="email" label="Email" />
    <Field
      required
      name="role"
      label="Role"
      component="DropdownSelect"
      options={[{ value: 'OWNER' }, { value: 'ADMIN' }, { value: 'MANAGER' }]}
    />
    <Field name="isSSO" label="Is SSO user?" component="Toggle" />
    <Field
      required
      type="password"
      name="password"
      validate={[passwordsValidate, passwordStrength]}
      label="Password"
    />
    <Field
      required
      type="password"
      name="confirmPassword"
      validate={[passwordsValidate, passwordStrength]}
      label="Password Confirmation"
    />
  </Form>
);

NewUserForm.propTypes = {
  formName: PropTypes.string,
  sendNewUser: PropTypes.func.isRequired,
  formStyle: PropTypes.string,
};

NewUserForm.defaultProps = {
  formName: null,
  formStyle: null,
};

export default NewUserForm;
