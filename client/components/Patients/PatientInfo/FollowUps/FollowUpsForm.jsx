
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';
import FetchFollowUpTypes from '../../../GraphQL/PatientFollowUps/fetchFollowUpTypes';
import Loader from '../../../Loader';
import styles from './formStyles.scss';

const addDays = (days) => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  result.setHours(0);
  return result;
};

const addMonths = (months) => {
  const result = new Date();
  result.setMonth(result.getMonth() + months);
  result.setHours(0);
  return result;
};

const helpersList = [
  {
    label: 'Tomorrow',
    value: addDays(1),
  },
  {
    label: 'Next Week',
    value: addDays(7),
  },
  {
    label: 'Next Month',
    value: addMonths(1),
  },
  {
    label: 'In 3 Months',
    value: addMonths(3),
  },
  {
    label: 'Next Year',
    value: addMonths(12),
  },
];

export default function FollowUpsForm({
  accountUsers,
  onSubmit,
  initialValues,
  formName,
  className,
  isUpdate,
}) {
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
      <Field
        required
        name="dueAt"
        label="Due Date"
        data-test-id="dueDate"
        helpersList={helpersList}
        component="DayPickerWithHelpers"
      />
      <FetchFollowUpTypes>
        {({ loading, error, data: { patientFollowUpTypes } }) => {
          if (loading) return <Loader isLoaded={loading} />;
          if (error) return `Error!: ${error}`;
          return (
            <Field
              required
              name="patientFollowUpTypeId"
              label="Reason"
              data-test-id="reason"
              component="DropdownSelect"
              options={patientFollowUpTypes}
            />
          );
        }}
      </FetchFollowUpTypes>
      <Field
        required
        name="assignedUserId"
        label="Assigned To"
        data-test-id="user-field-followup-form"
        component="DropdownSelect"
        options={accountUsers}
      />
      <Field name="note" label="Note" data-test-id="note" component="TextArea" />
    </Form>
  );
}

FollowUpsForm.propTypes = {
  accountUsers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
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
