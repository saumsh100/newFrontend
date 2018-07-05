
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';
import { emailValidate } from '../../../library/Form/validate';
import { accountShape } from '../../../library/PropTypeShapes';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength25 = maxLength(50);

const emailValidateNull = (str) => {
  if (str && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};

export default function GeneralForm({ role, onSubmit, activeAccount }) {
  const initialValues = {
    name: activeAccount.get('name'),
    website: activeAccount.get('website'),
    phoneNumber: activeAccount.get('phoneNumber'),
    contactEmail: activeAccount.get('contactEmail'),
  };

  const emailValid = role === 'SUPERADMIN' ? emailValidateNull : emailValidate;

  return (
    <Form
      form="clinicDetailsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="clinicDetailsForm"
    >
      <Field name="name" label="Name" validate={[maxLength25]} data-test-id="name" />
      <Field name="website" label="Website" data-test-id="website" />
      <Field
        name="phoneNumber"
        label="Contact Phone Number"
        type="tel"
        data-test-id="phoneNumber"
      />
      <Field
        name="contactEmail"
        label="Contact Email"
        validate={[emailValid]}
        data-test-id="contactEmail"
      />
    </Form>
  );
}

GeneralForm.propTypes = {
  activeAccount: PropTypes.shape(accountShape).isRequired,
  onSubmit: PropTypes.func.isRequired,
  role: PropTypes.string,
};

GeneralForm.defaultProps = {
  role: '',
};
