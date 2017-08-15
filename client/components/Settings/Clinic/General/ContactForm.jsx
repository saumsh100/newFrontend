import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';
import { emailValidate, parseNum, notNegative, } from '../../../library/Form/validate';

const emailValidateNull = (str) => {
  if (str !== null && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};

export default function ContactForm({ onSubmit, activeAccount, role }) {
  const initialValues = {
    phoneNumber: activeAccount.get('phoneNumber'),
    contactEmail: activeAccount.get('contactEmail'),
  };

  const emailValid = role === 'SUPERADMIN' ? emailValidateNull : emailValidate;

  return (
    <Form
      form="contactSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
      <div className={styles.paddingField}>
        <Field
          name="phoneNumber"
          label="Contact Phone Number"
          type="tel"
          data-test-id="phoneNumber"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="contactEmail"
          label="Contact Email"
          validate={[emailValid]}
          data-test-id="contactEmail"
        />
      </div>
    </Form>
  );

}
