
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';
import { emailValidate } from '../../../library/Form/validate';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);


export default function GeneralForm({ onSubmit, activeAccount, users }) {

  const initialValues = {
    name: activeAccount.get('name'),
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    phoneNumber: activeAccount.get('phoneNumber'),
    contactEmail: activeAccount.get('contactEmail'),
    website: activeAccount.get('website'),
    timezone: activeAccount.get('timezone'),
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

  const options = moment.tz.names().map((value) => {
    return {
      value,
    };
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
      <div className={styles.paddingField}>
        <Field
          name="timezone"
          label="Timezone"
          component="DropdownSelect"
          options={options}

        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="phoneNumber"
          label="Contact Phone Number"
          type="tel"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="contactEmail"
          label="Contact Email"
          validate={[emailValidate]}
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="website"
          label="Website"
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
