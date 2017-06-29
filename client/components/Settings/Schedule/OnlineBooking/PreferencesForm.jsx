import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';
import styles from './styles.scss';

export default function PreferencesForm({ handleSubmit, activeAccount, }) {
  const initialValues = {
    bookingWidgetPrimaryColor: activeAccount.get('bookingWidgetPrimaryColor') || '#FF715A',
  };

  return (
    <Form
      form="selectAccountColor"
      onSubmit={handleSubmit}
      className={styles.preferencesForm}
      initialValues={initialValues}
      data-test-id="selectAccountColorForm"
    >
      <Field
        component="ColorPicker"
        label="Primary Widget Color"
        name="bookingWidgetPrimaryColor"
        data-test-id="colorInput"
      />
    </Form>
  );
}

PreferencesForm.propTypes = {
  handleSubmit: PropTypes.func,
};
