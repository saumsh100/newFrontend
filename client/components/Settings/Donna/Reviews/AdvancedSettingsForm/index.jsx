
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';

export default function AdvancedSettingsForm({ form, initialValues, onSubmit }) {
  return (
    <Form
      ignoreSaveButton
      form={form}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id={form}
    >
      <Field
        component="Toggle"
        name="sendUnconfirmedReviews"
        label="Send Review Requests to Unconfirmed Appointments?"
      />
    </Form>
  );
}

AdvancedSettingsForm.propTypes = {
  form: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
