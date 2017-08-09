import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';
import { notNegative, } from '../../../library/Form/validate';

const maxUnitSize = value => value && value > 60 ? 'Must be less than or equal to 180' : undefined;

export default function SuperAdminForm({ onSubmit, activeAccount }) {
  const initialValues = {
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    unit: activeAccount.get('unit'),
  };

  return (
    <Form
      form="superAdminSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
      <div className={styles.paddingField}>
        <Field
          name="twilioPhoneNumber"
          label="Twilio Phone Number"
          type="tel"
          data-test-id="twilioPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="destinationPhoneNumber"
          label="Destination Phone Number"
          type="tel"
          data-test-id="destinationPhoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="vendastaId"
          label="Vendasta Id"
          data-test-id="vendastaId"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="unit"
          label="Schedule Unit"
          type="number"
          validate={[notNegative, maxUnitSize]}
        />
      </div>
    </Form>
  );

}
