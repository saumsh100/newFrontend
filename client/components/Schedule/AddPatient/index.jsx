
import PropTypes from 'prop-types';
import React from 'react';
import PatientUser from '../../../entities/models/PatientUser';
import { getFormattedDate } from '../../library';
import NewPatientForm from '../../Patients/PatientTable/HeaderSection/NewPatientForm';

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

  return <NewPatientForm onSubmit={onSubmit} formName={formName} initialValues={initialValues} />;
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
