
import PropTypes from 'prop-types';
import React from 'react';
import PatientUser from '../../../entities/models/PatientUser';
import { Form, Field, getFormattedDate } from '../../library';
import {
  maxLength,
  emailValidate,
  validateBirthdate,
  normalizeBirthdate,
} from '../../library/Form/validate';

const options = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

export default function AddPatient({ onSubmit, formName, mergingPatientData }) {
  let initialValues = {};

  if (mergingPatientData) {
    const { patientUser } = mergingPatientData;

    const { firstName, lastName, email, phoneNumber, birthDate, gender } = patientUser;

    initialValues = {
      firstName,
      lastName,
      email,
      mobilePhoneNumber: phoneNumber,
      birthDate: birthDate ? getFormattedDate(birthDate, 'MM/DD/YYYY') : null,
      gender,
    };
  }

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      allowSave
      data-test-id="newPatientForm"
      ignoreSaveButton
      key={`Patient Creation Form Name_${formName}`}
    >
      <div>*This will create a new patient in your practice software and in CareCru</div>
      <Field required name="firstName" validate={[maxLength(255)]} label="First Name" />
      <Field required name="lastName" validate={[maxLength(255)]} label="Last Name" />
      <Field name="gender" label="Gender" component="DropdownSelect" options={options} />
      <Field name="mobilePhoneNumber" label="Mobile Phone Number" type="tel" />
      <Field type="email" name="email" validate={[emailValidate]} label="Email" />
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
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mergingPatientData: PropTypes.shape({
    patientUser: PropTypes.instanceOf(PatientUser),
    requestData: PropTypes.shape({
      serviceId: PropTypes.string,
      practitionerId: PropTypes.string,
    }),
  }).isRequired,
};
