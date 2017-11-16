
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

export default function NewPatientForm({ onSubmit, formName, mergingPatientData, }) {

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
    mobilePhoneNumber: phoneNumber,
  };

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      asyncValidate={asyncValidateNewPatient}
      allowSave
      data-test-id="newPatientForm"
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
          name="gender"
          label="Gender"
          component="DropdownSelect"
          options={options}
        />
      </div>
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

NewPatientForm.propTypes = {
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  mergingPatientData: PropTypes.object,
  handleDatePickeer: PropTypes.func,
};
