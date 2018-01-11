
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Field } from '../../../../library';
import styles from './styles.scss';

// TODO: we need a component/structure for clinics to easily override with their colors
const DefaultSubmitButton = ({ pristine }) => (
  <Button
    // primary
    disabled={pristine}
    type="submit"
    className={styles.submitButton}
  >
    Update Preferences
  </Button>
);

export default function PatientPreferencesForm({ initialValues, onSubmit }) {
  return (
    <Form
      form="patientPreferencesForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      SubmitButton={DefaultSubmitButton}
    >
      <Field
        name="reminders"
        label="Appointment Reminders"
        component="Toggle"
        className={styles.preferenceToggle}
      />
      <Field
        name="newsletter"
        label="Newsletters & Special Promotions"
        component="Toggle"
        className={styles.preferenceToggle}
      />
    </Form>
  );
}

PatientPreferencesForm.propTypes = {

};
