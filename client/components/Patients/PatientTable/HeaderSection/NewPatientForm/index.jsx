
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Field } from '../../../../library';
import styles from '../../styles.scss';

import { maxLength, emailValidate, asyncValidateNewPatient } from '../../../../library/Form/validate';

const normalizeBirthdate = (value) => {
  return value.trim();
};

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value) && value !== undefined) {
    return format;
  } else {
    const date = moment(value, format);
    const isValid = date.isValid();
    if (!isValid && value !== undefined) {
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
      asyncValidate={asyncValidateNewPatient}
      asyncBlurFields={['email', 'mobilePhoneNumber']}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(25)]}
        label="First Name"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(25)]}
        label="Last Name"
      />
      <div className={styles.spacing}>
      <Field
        name="gender"
        label="Gender"
        component="DropdownSelect"
        options={options}
      />
      </div>
      <Field
        name="mobilePhoneNumber"
        type="tel"
        label="Mobile Phone Number"
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
