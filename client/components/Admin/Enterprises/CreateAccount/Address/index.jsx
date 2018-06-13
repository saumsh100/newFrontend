
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import {
  caProvinces,
  usStates,
} from '../../../../Settings/Practice/General/Address/selectConstants';
import styles from '../styles.scss';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

const countryOptions = [
  {
    value: 'CA',
    label: 'Canada',
  },
  {
    value: 'US',
    label: 'United States',
  },
];

export default function Address(props) {
  const { onSubmit, index, initialValues, formName, country, setCountry } = props;

  const stateProv = country === 'US' ? usStates : caProvinces;
  const zipPostal = country === 'US' ? 'Zip Code' : 'Postal Code';

  const zipPostalVal = (value) => {
    const regex = new RegExp(
      /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] ?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
    );

    if (country === 'US') {
      return value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'Please enter a proper zipcode.';
    } else if (!regex.test(value)) {
      return 'Please enter a proper postal code.';
    }

    return undefined;
  };

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div>
        <Field required name="street" label="Street Address" />
      </div>
      <div className={styles.selectPadding}>
        <Field
          name="country"
          label="Country"
          component="DropdownSelect"
          options={countryOptions}
          onChange={(e, value) => setCountry(value)}
          required
        />
      </div>
      <div className={styles.selectPadding}>
        <Field required name="state" label="State" component="DropdownSelect" options={stateProv} />
      </div>
      <div className={styles.addressColPlain}>
        <Field required name="city" label="City" />
      </div>
      <div className={styles.addressColPlain_padding}>
        <Field name="zipCode" label={zipPostal} validate={[zipPostalVal]} maxLength="7" required />
      </div>
    </Form>
  );
}

Address.propTypes = {
  onSubmit: PropTypes.func,
  index: PropTypes.number,
  initialValues: PropTypes.objectOf(PropTypes.string),
  formName: PropTypes.string,
  country: PropTypes.string,
  setCountry: PropTypes.func,
};
