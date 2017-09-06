
import React, { PropTypes, Component } from 'react';
import { Form, Field, Button } from '../../../../library';
import { emailValidate, maxLength, passwordsValidate, passwordStrength, asyncEmailValidateUser } from '../../../../library/Form/validate';

export default function AddUser(props) {
  const {
    onSubmit,
    index,
    initialValues,
    formName,
  } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      asyncValidate={asyncEmailValidateUser}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field
        required
        validate={[maxLength(25)]}
        name="firstName"
        label="First Name"
      />
      <Field
        required
        validate={[maxLength(25)]}
        name="lastName"
        label="Last Name"
      />
      <Field
        required
        validate={[emailValidate]}
        type="email"
        name="email"
        label="Email"
      />
      <Field
        required
        name="role"
        label="Role"
        component="DropdownSelect"
        options={[
          { value: 'OWNER' },
          { value: 'ADMIN' },
          { value: 'MANAGER' },
        ]}
      />
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
}

AddUser.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  index: PropTypes.number,
  formName: PropTypes.string,
};
