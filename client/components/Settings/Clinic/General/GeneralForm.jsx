
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field, } from '../../../library';
import styles from './styles.scss';
import jwt from 'jwt-decode';
import { emailValidate, parseNum, notNegative } from '../../../library/Form/validate';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(50);

const emailValidateNull = (str) => {
  if (str !== null && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};

const maxUnitSize = value => value && value > 60 ? 'Must be less than or equal to 180' : undefined;

export default function GeneralForm({ onSubmit, activeAccount, role }) {
  const initialValues = {
    name: activeAccount.get('name'),
    twilioPhoneNumber: activeAccount.get('twilioPhoneNumber'),
    destinationPhoneNumber: activeAccount.get('destinationPhoneNumber'),
    vendastaId: activeAccount.get('vendastaId'),
    website: activeAccount.get('website'),
    timeInterval: activeAccount.get('timeInterval'),
    timezone: activeAccount.get('timezone'),
    unit: activeAccount.get('unit')
  };

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

  return (
    <Form
      form="generalSettingsForm"
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id="generalSettingsForm"
      alignSave="left"
    >
      <div className={styles.paddingSave}>
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
            name="website"
            label="Website"
            data-test-id="website"
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
            name="timeInterval"
            label="Interval for Booking Widget"
            component="DropdownSelect"
            options={optionsInterval}

          />
        </div>
      </div>
    </Form>
  );
}

GeneralForm.propTypes = {
  activeAccount: PropTypes.object.required,
  onSubmit: PropTypes.func,
}
