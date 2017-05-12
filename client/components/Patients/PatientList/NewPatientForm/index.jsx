import React, { PropTypes } from 'react';
import { Form, Field, DayPicker } from '../../../library';

import { maxLength, asyncEmailValidateUser, emailValidate, phoneValidate } from '../../../library/Form/validate';


export default function NewPatientForm({ onSubmit, saveBirthday, birthday, formName }) {
  const options = [
    { value: 'Male' },
    { value: 'Female' },
  ];


  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      ignoreSaveButton={true}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(15)]}
        label="Last Name"
      />
      <Field
        required
        name="gender"
        label="Gender"
        component="DropdownSelect"
        options={options}
      />
      <Field
        required
        name="phoneNumber"
        validate={[phoneValidate]}
        label="Phone Number"
      />
      <Field
        required
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
      />
      <Field
        required
        component="DayPicker"
        name="birthDate"
        label="Birth Date"
      />
    </Form>
  );
}

NewPatientForm.propTypes = {
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
