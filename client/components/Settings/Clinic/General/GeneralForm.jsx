
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field } from '../../../library';
import { emailValidate } from '../../../library/Form/validate';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength25 = maxLength(50);

export default function GeneralForm({ onSubmit, activeAccount }) {
  const initialValues = {
    name: activeAccount.get('name'),
    website: activeAccount.get('website'),
  };

  return (
    <Form
      form="clinicDetailsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="clinicDetailsForm"
      alignSave="left"
    >
      <Field name="name" label="Name" validate={[maxLength25]} data-test-id="name" />
      <Field name="website" label="Website" data-test-id="website" />
    </Form>
  );
}

GeneralForm.propTypes = {
  activeAccount: PropTypes.object.required,
  onSubmit: PropTypes.func,
};
