
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, isDateValid } from '../../../../library';
import styles from '../../styles.scss';

import { maxLength, emailValidate } from '../../../../library/Form/validate';

const normalizeBirthdate = value => value.trim();

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value) && value !== undefined) {
    return format;
  }
  if (!isDateValid(value, format) && value !== undefined) {
    return format;
  }
  return undefined;
};

const options = [{ value: 'Male' }, { value: 'Female' }];

export default function NewPatientForm({ onSubmit, formName }) {
  return (
    <Form form={formName} onSubmit={onSubmit} ignoreSaveButton data-test-id={formName}>
      <div>*This will create a new patient in your practice software and in CareCru</div>
      <Field
        required
        name="firstName"
        validate={[maxLength(25)]}
        label="First Name"
        data-test-id="firstName"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(25)]}
        label="Last Name"
        data-test-id="lastName"
      />
      <div className={styles.spacing}>
        <Field
          name="gender"
          label="Gender"
          component="DropdownSelect"
          options={options}
          data-test-id="gender"
        />
      </div>
      <Field
        name="mobilePhoneNumber"
        type="tel"
        label="Mobile Phone Number"
        data-test-id="mobilePhoneNumber"
      />
      <Field
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
        data-test-id="email"
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
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
