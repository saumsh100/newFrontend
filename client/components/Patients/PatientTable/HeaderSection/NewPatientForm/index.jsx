
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import styles from '../../styles.scss';

import {
  maxLength,
  emailValidate,
  normalizeBirthdate,
  validateBirthdate,
} from '../../../../library/Form/validate';
import FormWarning from '../../../../library/Form/FormWarning';
import { httpClient } from '../../../../../util/httpClient';

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

export default function NewPatientForm({ onSubmit, formName, initialValues = {} }) {
  const [showWarning, setShowWarning] = useState(false);

  const isPatientDuplicate = async (values) => {
    const { firstName, lastName, mobilePhoneNumber, birthDate } = values;
    const phoneNumber = mobilePhoneNumber.replace(/\s/g, '');
    if (firstName && lastName && mobilePhoneNumber && birthDate) {
      const res = await httpClient().get('api/patients/find', {
        params: {
          firstName: firstName?.trim(),
          lastName: lastName?.trim(),
          birthDate: birthDate?.trim(),
          phoneNumber,
        },
      });
      if (res?.data?.result?.length > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
  };

  return (
    <>
      {showWarning && (
        <FormWarning
          onClose={() => {
            setShowWarning(false);
          }}
          message="A patient already exists with this first name, last name, birthday and phone number. Please check all fields before adding this patient."
        />
      )}
      <Form
        form={formName}
        onSubmit={onSubmit}
        onChange={isPatientDuplicate}
        initialValues={initialValues}
        ignoreSaveButton
        data-test-id={formName}
        key={`Patient Creation Form Name_${formName}`}
      >
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
    </>
  );
}

NewPatientForm.propTypes = {
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    mobilePhoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
  }),
};

NewPatientForm.defaultProps = {
  initialValues: {},
};
