import React, { PropTypes } from 'react';
import { Form, Field, DayPicker } from '../../../library';
import styles from '../main.scss';

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
      ignoreSaveButton
      data-test-id="newUser"
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
        data-test-id="firstName"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(15)]}
        label="Last Name"
        data-test-id="lastName"
      />
      <div className={styles.spacing}>
      <Field
        required
        name="gender"
        label="Gender"
        component="DropdownSelect"
        options={options}
        data-test-id="gender"
      />
      </div>
      <Field
        required
        name="mobilePhoneNumber"
        type="tel"
        label="Phone Number"
        data-test-id="mobilePhoneNumber"
      />
      <Field
        required
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
        data-test-id="email"
      />
      <Field
        required
        component="DayPicker"
        name="birthDate"
        label="Birth Date"
        data-test-id="birthDate"
      />
    </Form>
  );
}

NewPatientForm.propTypes = {
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};
