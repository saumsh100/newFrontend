import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import { maxLength } from '../../../library/Form/validate';


export default function EditPatientForm({ onSubmit, formName, styles, currentPatient }) {

  const key = currentPatient.id;
  const initialValues = {
    firstName: currentPatient.firstName,
    lastName: currentPatient.lastName,
  };

  return (
    <Form
      key={key}
      form={formName}
      onSubmit={onSubmit}
      ignoreSaveButton
      className={styles.form}
      initialValues={initialValues}
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
      <Button
        type="submit"
        className={styles.formButton}
      >
        Change Info
      </Button>
    </Form>
  );
}

EditPatientForm.propTypes = {
  formName: PropTypes.string,
  styles: PropTypes.object,
  currentPatient: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
