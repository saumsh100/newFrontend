
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import styles from './styles.scss';

const Question = props => <div className={styles.question} {...props} />;

export default function AdvancedRemindersSettingsForm({ form, initialValues, onSubmit }) {
  return (
    <Form
      ignoreSaveButton
      enableReinitialize
      form={form}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id={form}
    >
      <Question>Do you want Donna to send Appointment Reminders to Inactive Patients?</Question>
      <Field
        component="Toggle"
        name="canSendRemindersToInactivePatients"
        className={styles.toggleWrapper}
      />
    </Form>
  );
}

AdvancedRemindersSettingsForm.propTypes = {
  form: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
