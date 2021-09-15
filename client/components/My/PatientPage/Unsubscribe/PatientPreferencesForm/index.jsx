import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Field } from '../../../../library';
import styles from './styles.scss';

// TODO: we need a component/structure for clinics to easily override with their colors
const DefaultSubmitButton = ({ pristine }) => (
  <Button
    // primary
    fluid
    disabled={pristine}
    type="submit"
  >
    Update Preferences
  </Button>
);

DefaultSubmitButton.propTypes = {
  pristine: PropTypes.bool.isRequired,
};

export default function PatientPreferencesForm({ initialValues, onSubmit }) {
  return (
    <Form
      form="patientPreferencesForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      SaveButton={DefaultSubmitButton}
    >
      <Field
        name="reminders"
        label="Appointment Reminders"
        component="Toggle"
        className={styles.preferenceToggle}
      />
      <Field
        name="recalls"
        label="Due Date Reminders"
        component="Toggle"
        className={styles.preferenceToggle}
      />
      <Field
        name="reviews"
        label="Practice Reviews"
        component="Toggle"
        className={styles.preferenceToggle}
      />
      <Field
        name="birthdayMessage"
        label="Special/Holiday Messages"
        component="Toggle"
        className={styles.preferenceToggle}
      />
      <Field
        name="newsletter"
        label="Newsletter"
        component="Toggle"
        className={styles.preferenceToggle}
      />
    </Form>
  );
}

PatientPreferencesForm.propTypes = {
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
