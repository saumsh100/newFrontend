
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';
import { emailValidate, parseNum, notNegative } from '../../../library/Form/validate';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(50);

const maxDuration = value => value && value > 180 ? 'Must be less than or equal to 180' : undefined;

export default function GeneralForm({ onSubmit, activeAccount, users }) {

  const initialValues = {
    name: activeAccount.get('name'),
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    phoneNumber: activeAccount.get('phoneNumber'),
    contactEmail: activeAccount.get('contactEmail'),
    website: activeAccount.get('website'),
    timeInterval: activeAccount.get('timeInterval'),
    timezone: activeAccount.get('timezone'),
    unit: activeAccount.get('unit')
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
  //TODO do we need all timezones and the overlap
  const options = moment.tz.names().map((value) => {
    return {
      value,
    };
  });

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

  const display = (role === 'SUPERADMIN' ? (<div>
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
    <div className={styles.paddingField}>
      <Field
        required
        name="unit"
        label="Schedule Unit"
        validate={[notNegative, maxDuration]}
      />
    </div>
  </div>) : null);

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
          name="timezone"
          label="Timezone"
          component="DropdownSelect"
          options={options}
          data-test-id="timezone"

        />
      </div>
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
          validate={[emailValidate]}
          data-test-id="contactEmail"
        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="timeInterval"
          label="Interval for Booking Widget"
          component="DropdownSelect"
          options={optionsInterval}

        />
      </div>
      <div className={styles.paddingField}>
        <Field
          name="website"
          label="Website"
          data-test-id="website"
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
