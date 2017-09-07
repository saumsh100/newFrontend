
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
      <span>
        Set Up Reputation Management
      </span>
      <div>
        <Field
          component="Toggle"
          name="reputationManagement"
        />
      </div>
      <span> Can Send Reminders? </span>
      <div>
        <Field
          component="Toggle"
          name="canSendReminders"
        />
      </div>
      <span> Can Send Recalls? </span>
      <div>
        <Field
          component="Toggle"
          name="canSendRecalls"
        />
      </div>
      <span>
        Set Up Call Tracking
      </span>
      <div>
        <Field
          component="Toggle"
          name="callTracking"
        />
      </div>
    </Form>
  );
}
