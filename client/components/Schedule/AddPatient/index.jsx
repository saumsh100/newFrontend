
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Field, DayPicker } from '../../library';
import styles from './styles.scss';

import { maxLength, asyncValidateNewPatient, emailValidate, phoneValidate } from '../../library/Form/validate';

const normalizeBirthdate = (value) => {
  return value.trim();
};

const validateBirthdate = (value) => {
  if (value === undefined) {
    return;
  }
  const format = 'MM/DD/YYYY';
  const pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value)) {
    return format;
  } else {
    const date = moment(value, format);
    const isValid = date.isValid();
    if (!isValid) {
      return format;
    }
  }
};

const options = [
  { value: 'Male' },
  { value: 'Female' },
];

export default function AddPatient({ onSubmit, formName, mergingPatientData, }) {
  let initialValues = {};

  if (mergingPatientData) {
    const patientUser = mergingPatientData.patientUser;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
    } = patientUser;

    initialValues = {
      firstName,
      lastName,
      email,
      mobilePhoneNumber: phoneNumber,
    };
  }

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      asyncValidate={asyncValidateNewPatient}
      allowSave
      data-test-id="newPatientForm"
      ignoreSaveButton
      key={`Patient Creation Form Name_${formName}`}
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
        name="gender"
        label="Gender"
        component="DropdownSelect"
        options={options}
      />
      <Field
        name="mobilePhoneNumber"
        label="Phone Number"
        type="tel"
      />
      <Field
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
      />
      <Field
        normalize={normalizeBirthdate}
        validate={[validateBirthdate]}
        name="birthDate"
        label="Birth Date (MM/DD/YYYY)"
        data-test-id="birthDate"
      />
    </Form>
  );
}

AddPatient.propTypes = {
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  mergingPatientData: PropTypes.object,
  handleDatePickeer: PropTypes.func,
};