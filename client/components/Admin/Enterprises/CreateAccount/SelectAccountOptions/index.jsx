
import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../../library';
import { emailValidate } from '../../../../library/Form/validate';


export default function SelectAccountOptions(props) {
  const {
    onSubmit,
    index,
    initialValues,
    formName,
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
      <Field
        name="destinationPhoneNumber"
        label="Destination Phone Number"
        type="tel"
      />
      <span>
        Set Up Vendasta
      </span>
      <div>
        <Field
          component="Toggle"
          name="vendasta"
        />
      </div>
      <span>
        Set Up Twilio
      </span>
      <div>
        <Field
          component="Toggle"
          name="twilio"
        />
      </div>
      <span>
        Set Up Call Rails
      </span>
      <div>
        <Field
          component="Toggle"
          name="callRails"
        />
      </div>
    </Form>
  );
}
