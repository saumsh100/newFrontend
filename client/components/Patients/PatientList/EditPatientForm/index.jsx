import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import { maxLength } from '../../../library/Form/validate';


export default function EditPatientForm({ onSubmit, formName, styles, currentPatient, onDelete }) {

  return (<div>
    <Form form={formName}
          onSubmit={onSubmit}
          ignoreSaveButton={true}
          className={styles.form}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label={currentPatient.firstName}
      />
      <Field
        required
        name='lastName'
        validate={[maxLength(15)]}
        label={currentPatient.lastName}
      />
      <Button
        type="submit"
        className={styles.formButton}
      >
        Change Info
      </Button>
    </Form>
    <Button
      className={styles.formButton}
      onClick={onDelete}
      >
      Delete Patient
    </Button>
    </div>
  );
}

EditPatientForm.propTypes = {
  formName: PropTypes.string,
  styles: PropTypes.object,
  currentPatient: PropTypes.object,
  onDelete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
