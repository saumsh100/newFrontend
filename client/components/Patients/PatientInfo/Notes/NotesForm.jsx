
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';

export default function NotesForm({ onSubmit, initialValues, formName, className }) {
  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      className={className}
      data-test-id={formName}
      ignoreSaveButton
    >
      <Field required name="note" label="Note" data-test-id="note" component="TextArea" />
    </Form>
  );
}

NotesForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  className: PropTypes.string,
  initialValues: PropTypes.shape({}).isRequired,
};

NotesForm.defaultProps = {
  className: null,
};
