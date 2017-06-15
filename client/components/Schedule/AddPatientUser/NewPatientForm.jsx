import React, { PropTypes } from 'react';
import { Form, Field, DayPicker } from '../../library';
import styles from '../styles.scss';

import { maxLength, asyncEmailValidateUser, emailValidate, phoneValidate } from '../../library/Form/validate';


export default function NewPatientForm({ onSubmit, formName, mergingPatientData }) {
  const options = [
    { value: 'Male' },
    { value: 'Female' },
  ];

  const patientUser = mergingPatientData.patientUser;

  const {
    firstName,
    lastName,
    email,
    mobilePhoneNumber,
  } = patientUser;

  const initialValues = {
    firstName,
    lastName,
    email,
    mobilePhoneNumber,
  };

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
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
      <div className={styles.formContainer_spacing}>
        <Field
          required
          name="gender"
          label="Gender"
          component="DropdownSelect"
          options={options}
        />
      </div>
      <Field
        required
        name="mobilePhoneNumber"
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
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};
