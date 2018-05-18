
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library';

export default function AppBookedForm({ wasApptBooked, handleToggle, id }) {
  const initialValues = {
    id: wasApptBooked,
  };

  return (
    <Form
      form={`appBookedForm_${id}`}
      onChange={values => handleToggle(values)}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field name={id} component="Toggle" />
    </Form>
  );
}

AppBookedForm.propTypes = {
  wasApptBooked: PropTypes.bool,
  handleToggle: PropTypes.func,
  id: PropTypes.string,
};
