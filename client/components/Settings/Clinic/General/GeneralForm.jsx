
import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import styles from './styles.scss';

export default function GeneralForm({ onSubmit, activeAccount }) {
  const initialValues = {
    name: activeAccount.get('name'),
  };

  return (
    <Form form="generalSettingsForm"
          onSubmit={onSubmit}
          initialValues={initialValues}
          className={styles.generalForm}
    >
      <Field
        required
        name="name"
        label="Name"
      />
    </Form>
  );
}

GeneralForm.propTypes = {
  onSubmit: PropTypes.func,
}