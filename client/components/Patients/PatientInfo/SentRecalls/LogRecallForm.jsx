
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';

const options = [
  {
    label: 'Phone',
    value: 'phone',
  },
  {
    label: 'SMS',
    value: 'sms',
  },
  {
    label: 'Email',
    value: 'email',
  },
];

export default function LogRecallForm({ onSubmit, initialValues, formName, className }) {
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
        disabled
        name="createdAt"
        label="Date Sent"
        date-test-id="createdAt"
        component="DayPicker"
      />
      <Field
        required
        name="primaryType"
        label="Contact Method"
        date-test-id="primaryType"
        component="DropdownSelect"
        options={options}
      />
      <Field name="note" label="Note" data-test-id="note" component="TextArea" />
    </Form>
  );
}

LogRecallForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.shape({}).isRequired,
};

LogRecallForm.defaultProps = {
  className: null,
};
