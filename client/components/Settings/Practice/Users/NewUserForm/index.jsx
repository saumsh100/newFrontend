
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from '../../../../library';
import {
  emailValidate,
  maxLength,
  passwordsValidate,
  passwordStrength,
  asyncEmailValidateUser,
} from '../../../../library/Form/validate';
import InviteUserForm from '../InviteUserForm';

class NewUserForm extends Component {
  render() {
    const { sendNewUser, formName, mainStyle, formStyle } = this.props;
    return (
      <Form
        className={formStyle}
        form={formName}
        onSubmit={sendNewUser}
        asyncValidate={asyncEmailValidateUser}
        ignoreSaveButton
      >
        <Field
          required
          validate={[maxLength(25)]}
          name="firstName"
          label="First Name"
          data-test-id="firstName"
        />
        <Field
          required
          validate={[maxLength(25)]}
          name="lastName"
          label="Last Name"
          data-test-id="lastName"
        />
        <Field
          required
          validate={[emailValidate]}
          type="email"
          name="email"
          label="Email"
          data-test-id="email"
        />
        <Field
          required
          name="role"
          label="Role"
          component="DropdownSelect"
          options={[{ value: 'OWNER' }, { value: 'ADMIN' }, { value: 'MANAGER' }]}
          data-test-id="role"
        />
        <Field
          required
          type="password"
          name="password"
          validate={[passwordsValidate, passwordStrength]}
          label="Password"
          data-test-id="password"
        />
        <Field
          required
          type="password"
          name="confirmPassword"
          validate={[passwordsValidate, passwordStrength]}
          label="Password Confirmation"
          data-test-id="confirmPassword"
        />
      </Form>
    );
  }
}

NewUserForm.propTypes = {
  formName: PropTypes.string,
  sendNewUser: PropTypes.func.isRequired,
  mainStyle: PropTypes.string,
  formStyle: PropTypes.string,
};

NewUserForm.defaultProps = {
  formName: null,
  mainStyle: null,
  formStyle: null,
};

export default NewUserForm;
