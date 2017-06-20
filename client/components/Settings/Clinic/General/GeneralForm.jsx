
import React, { PropTypes } from 'react';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);


export default function GeneralForm({ onSubmit, activeAccount, users }) {

  const initialValues = {
    name: activeAccount.get('name'),
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
  };

  const token = localStorage.getItem('token');
  const decodedToken = jwt(token);
  let role = null;

  users.map((users) => {
    if (decodedToken.userId === users.id) {
      role = users.role
    }
    return null;
  });

  const display = (role === 'SUPERADMIN' ? (<div>
    <div className={styles.paddingField}>
        <Field
          required
          name="twilioPhoneNumber"
          label="Twilio Phone Number"
          type="tel"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          required
          name="destinationPhoneNumber"
          label="Destination Phone Number"
          type="tel"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          required
          name="vendastaId"
          label="Vendasta Id"
        />
      </div>
    </div>) : null);

  return (
    <Form
      form="generalSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      className={styles.generalRow}
    >
      <div className={styles.paddingField}>
        <Field
          name="name"
          label="Name"
          validate={[maxLength25]}
        />
      </div>
      {display}
    </Form>
  );
}

GeneralForm.propTypes = {
  activeAccount: PropTypes.object.required,
  onSubmit: PropTypes.func,
}
