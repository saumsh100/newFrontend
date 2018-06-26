
import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Field } from '../../library';

import {
  maxLength,
  asyncValidateNewPatient,
  emailValidate,
  validateBirthdate,
  normalizeBirthdate,
} from '../../library/Form/validate';

const options = [{ value: 'Male' }, { value: 'Female' }];

export default function AddPatient({ onSubmit, formName, mergingPatientData }) {
  let initialValues = {};

  if (mergingPatientData) {
    const patientUser = mergingPatientData.patientUser;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate,
      gender,
    } = patientUser;

    initialValues = {
      firstName,
      lastName,
      email,
      mobilePhoneNumber: phoneNumber,
      birthDate: birthDate ? moment(birthDate).format('MM/DD/YYYY') : null,
      gender,
    };
  }

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      asyncValidate={asyncValidateNewPatient}
      asyncBlurFields={['email', 'mobilePhoneNumber']}
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
      <Field name="mobilePhoneNumber" label="Mobile Phone Number" type="tel" />
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
