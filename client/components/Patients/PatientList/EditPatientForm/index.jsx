import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';

import { maxLength } from '../../../library/Form/validate';


export default function EditPatientForm({ onSubmit, saveBirthday, birthday, formName }) {

  return (
    <Form form={formName}
          onSubmit={submit}
          ignoreSaveButton={true}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(15)]}
        label="Last Name"
      />
    </Form>
  );
}

EditPatientForm.propTypes = {
  formName: PropTypes.string,
  saveBirthday: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
