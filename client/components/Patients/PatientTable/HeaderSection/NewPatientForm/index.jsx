
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Form, Field } from '../../../../library';
import styles from '../../styles.scss';

import {
  maxLength,
  emailValidate,
} from '../../../../library/Form/validate';

const normalizeBirthdate = value => value.trim();

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value) && value !== undefined) {
    return format;
  }
  const date = moment(value, format);
  const isValid = date.isValid();
  if (!isValid && value !== undefined) {
    return format;
  }
};

const options = [{ value: 'Male' }, { value: 'Female' }];

export default function NewPatientForm({ onSubmit, formName }) {
  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      ignoreSaveButton
      data-test-id={formName}
    >
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
  formName: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  saveBirthday: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};
