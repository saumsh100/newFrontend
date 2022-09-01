/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import {
  emailValidate,
  maxLength,
  asyncEmailValidateUser,
} from '../../../../library/Form/validate';

export default function AddUser(props) {
  const { onSubmit, index, initialValues, formName } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      asyncValidate={asyncEmailValidateUser}
      initialValues={initialValues}
      destroyOnUnmount={false}
      asyncBlurFields={['email']}
      ignoreSaveButton
    >
      <Field required validate={[maxLength(25)]} name="firstName" label="First Name" />
      <Field required validate={[maxLength(25)]} name="lastName" label="Last Name" />
      <Field required validate={[emailValidate]} type="email" name="email" label="Email" />
    </Form>
  );
}

AddUser.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string),
  index: PropTypes.number,
  formName: PropTypes.string,
};
