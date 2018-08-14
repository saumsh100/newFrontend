
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate } from '../../../../library/Form/validate';

export default function ContactDetails(props) {
  const {
    onSubmit, index, initialValues, formName,
  } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field name="phoneNumber" label="Contact Phone Number" type="tel" />
      <Field
        name="contactEmail"
        label="Contact Email"
        validate={[emailValidate]}
      />
    </Form>
  );
}
