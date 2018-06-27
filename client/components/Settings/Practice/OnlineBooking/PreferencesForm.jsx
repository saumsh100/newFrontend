
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library/index';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';

export default function PreferencesForm({ handleSubmit, activeAccount }) {
  const initialValues = {
    bookingWidgetPrimaryColor:
      activeAccount.get('bookingWidgetPrimaryColor') || '#FF715A',
  };

  return (
    <Form
      form="selectAccountColor"
      onSubmit={handleSubmit}
      className={styles.preferencesForm}
      initialValues={initialValues}
      data-test-id="selectAccountColorForm"
      alignSave="left"
    >
      <div className={styles.formContainer_pickerField}>
        <Field
          component="ColorPicker"
          label="Primary Widget Color"
          name="bookingWidgetPrimaryColor"
          data-test-id-child="colorInput"
          data-test-id="colorPicker"
        />
      </div>
    </Form>
  );
}

PreferencesForm.propTypes = {
  handleSubmit: PropTypes.func,
  activeAccount: PropTypes.shape(AccountShape),
};
