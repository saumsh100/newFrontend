
import React, {Component, PropTypes } from 'react';
import { Form, Field } from '../../../library';
import styles from './styles.scss';

export default function IntervalForm({ handleSubmit, activeAccount, }) {

  const initialValues = {
    timeInterval: activeAccount.get('timeInterval'),
  };

  const optionsInterval = [
    {
      value: 15,
    },
    {
      value: 30,
    },
    {
      value: 45,
    },
    {
      value: 60,
    },
  ];

  return (
    <Form
      form="intervalPreferenceForm"
      onSubmit={handleSubmit}
      initialValues={initialValues}
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
      <div className={styles.formContainer_intervalField}>
        <Field
          name="timeInterval"
          label="Interval for Booking Widget"
          component="DropdownSelect"
          options={optionsInterval}
        />
      </div>
    </Form>
  );
}
