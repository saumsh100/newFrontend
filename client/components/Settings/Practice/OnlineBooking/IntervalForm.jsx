
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library/index';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';

export default function IntervalForm({ handleSubmit, activeAccount }) {
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
      data-test-id="intervalPreferenceForm"
      alignSave="left"
    >
      <div className={styles.formContainer_intervalField}>
        <Field
          name="timeInterval"
          label="Interval for Booking Widget"
          component="DropdownSelect"
          options={optionsInterval}
          data-test-id="timeInterval"
        />
      </div>
    </Form>
  );
}

IntervalForm.propTypes = {
  handleSubmit: PropTypes.func,
  activeAccount: PropTypes.shape(AccountShape),
};
