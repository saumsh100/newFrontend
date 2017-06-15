import React, { PropTypes } from 'react';
import { Form, Field } from '../../../library';
import styles from './styles.scss';

export default function PreferencesForm({ handleSubmit, activeAccount, }) {
  const initialValues = {
    bookingWidgetPrimaryColor: activeAccount.get('bookingWidgetPrimaryColor') || '',
  };

  return (
    <Form
      form="selectAccountColor"
      onSubmit={handleSubmit}
      className={styles.preferencesForm}
      initialValues={initialValues}
    >
      <Field
        component="ColorPicker"
        label="Primary Widget Color"
        name="bookingWidgetPrimaryColor"
      />
    </Form>
  );
}

PreferencesForm.propTypes = {
  handleSubmit: PropTypes.func,
};
