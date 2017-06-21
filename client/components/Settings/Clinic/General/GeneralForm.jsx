
import React, { PropTypes } from 'react';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);


export default function GeneralForm({ onSubmit, activeAccount }) {

  const initialValues = {
    name: activeAccount.get('name'),
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
  };

  return (
    <Form
      form="generalSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      className={styles.generalRow}
      data-test-id="generalSettingsForm"
    >
      <div className={styles.paddingField}>
        <Field
          name="name"
          label="Name"
          validate={[maxLength25]}
          data-test-id="name"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          required
          name="twilioPhoneNumber"
          label="Twilio Phone Number"
          type="tel"
          data-test-id="twilioPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          required
          name="destinationPhoneNumber"
          label="Destination Phone Number"
          type="tel"
          data-test-id="destinationPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          required
          name="vendastaId"
          label="Vendasta Id"
          data-test-id="vendastaId"
        />
      </div>
    </Form>
  );
}

GeneralForm.propTypes = {
  activeAccount: PropTypes.object.required,
  onSubmit: PropTypes.func,
}
