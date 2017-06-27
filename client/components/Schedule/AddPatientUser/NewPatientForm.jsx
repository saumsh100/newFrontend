import React, { PropTypes } from 'react';
import { Form, Field, DayPicker } from '../../library';
import styles from './styles.scss';

import { maxLength, asyncValidateNewPatient, emailValidate, phoneValidate } from '../../library/Form/validate';


export default function NewPatientForm({ onSubmit, formName, mergingPatientData, }) {
  const options = [
    { value: 'Male' },
    { value: 'Female' },
  ];

  const patientUser = mergingPatientData.patientUser;

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
  } = patientUser;

  const initialValues = {
    firstName,
    lastName,
    email,
    phoneNumber,
  };

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      asyncValidate={asyncValidateNewPatient}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
      />
      <div className={styles.formContainer_spacing}>
        <Field
          required
          name="lastName"
          validate={[maxLength(15)]}
          label="Last Name"
        />
      </div>
      <div className={styles.formContainer_dropDown}>
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
        name="phoneNumber"
        label="Phone Number"
        type="tel"
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
        handleThisInput
      />
    </Form>
  );
}

NewPatientForm.propTypes = {
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  mergingPatientData: PropTypes.object,
  handleDatePickeer: PropTypes.func,
};
