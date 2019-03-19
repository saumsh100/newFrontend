
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';
import followUpReasonsList from './followUpReasonsList';

export default function FollowUpsForm({ onSubmit, initialValues, formName, className }) {
  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      className={className}
      data-test-id={formName}
      ignoreSaveButton
    >
      <Field required name="dueAt" label="Due Date" data-test-id="dueDate" component="DayPicker" />
      <Field
        required
        name="patientFollowUpTypeId"
        label="Reason"
        data-test-id="reason"
        component="DropdownSelect"
        options={followUpReasonsList}
      />
      <Field required name="note" label="Note" data-test-id="note" component="TextArea" />
    </Form>
  );
}

FollowUpsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.shape({}).isRequired,
};

FollowUpsForm.defaultProps = {
  className: null,
};
