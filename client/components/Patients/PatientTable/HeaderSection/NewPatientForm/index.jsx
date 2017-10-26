
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Field } from '../../../../library';
import styles from '../../styles.scss';

import { maxLength,  emailValidate, } from '../../../../library/Form/validate';

const normalizeBirthdate = (value) => {
  return value.trim();
};

const validateBirthdate = (value) => {
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

export default function NewPatientForm({ onSubmit, formName }) {
  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      ignoreSaveButton
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
      <div className={styles.spacing}>
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
        type="tel"
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
        normalize={normalizeBirthdate}
        validate={[validateBirthdate]}
        name="birthDate"
        label="Birth Date (MM/DD/YYYY)"
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
