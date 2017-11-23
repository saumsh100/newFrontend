import React from 'react';
import {Field, Form,} from '../../../library';
import {emailValidate,} from '../../../library/Form/validate';

const emailValidateNull = (str) => {
  if (str !== null && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};

export default function ContactForm({ onSubmit, activeAccount, role }) {
  const initialValues = {
    phoneNumber: activeAccount.get('phoneNumber'),
    contactEmail: activeAccount.get('contactEmail'),
  };

  const emailValid = role === 'SUPERADMIN' ? emailValidateNull : emailValidate;

  return (
    <Form
      form="contactSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
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
