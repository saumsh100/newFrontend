
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';
import followUpReasonsList from './followUpReasonsList';
import styles from './formStyles.scss';

export default function FollowUpsForm({ onSubmit, initialValues, formName, className, isUpdate }) {
  return (
    <Form
      key={formName}
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      className={className}
      data-test-id={formName}
      ignoreSaveButton
    >
      <Field
        name="isCompleted"
        label="Task Completed"
        data-test-id="isCompleted"
        component="Toggle"
        className={isUpdate ? styles.shownToggle : styles.hiddenToggle}
      />
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
  initialValues: PropTypes.shape({ note: PropTypes.string }),
  isUpdate: PropTypes.bool,
};

FollowUpsForm.defaultProps = {
  className: null,
  initialValues: null,
  isUpdate: false,
};
