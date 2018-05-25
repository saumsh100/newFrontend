
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field } from '../../../../library';
import { caProv, usStates } from '../../../../Settings/Practice/General/Address/selectConstants';
import styles from '../styles.scss';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength25 = maxLength(50);
const maxPostalLength = maxLength(6);

export default function ClinicDetails(props) {
  const { onSubmit, index, initialValues, formName, country, setCountry } = props;

  const options = moment.tz
    .names()
    .map((value) => {
      const exp = new RegExp(/america/i);
      if (exp.test(value)) {
        return {
          value,
        };
      }
      return {
        value: null,
      };
    })
    .filter(filterValue => filterValue.value !== null);

  const stateProv = country === 'US' ? usStates : caProv;
  const zipPostal = country === 'US' ? 'Zip Code' : 'Postal Code';

  const zipPostalVal = (value) => {
    const regex = new RegExp(
      /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
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
      <div className={styles.clinicDetailsContainer}>
        <div>
          <Field name="name" label="Name" required />
        </div>
        <div>
          <Field name="website" label="Website" type="url" required />
        </div>
        <div className={styles.selectPadding}>
          <Field
            name="timezone"
            label="Timezone"
            component="DropdownSelect"
            options={options}
            search
            required
          />
        </div>
        {/*
        <div >
          <Field
            required
            name="street"
            label="Street Address"
          />
        </div>

        <div className={styles.selectPadding}>
          <Field
            name="country"
            label="Country"
            component="DropdownSelect"
            options={[{
              value: 'CA',
              label: 'Canada',
            }, {
              value: 'US',
              label: 'United States',
            }]}
            onChange={(e, value) => setCountry(value)}
            required
          />
        </div>
        <div className={styles.selectPadding}>
          <Field
            required
            name="state"
            label="State"
            component="DropdownSelect"
            options={stateProv}
          />
        </div>
        <div className={styles.addressColPlain}>
          <Field
            required
            name="city"
            label="City"
          />
        </div>
        <div className={styles.addressColPlain_padding}>
          <Field
            name="zipCode"
            label={zipPostal}
            validate={[maxPostalLength, zipPostalVal]}
            maxLength="6"
            required
          />
        </div>*/}
        <div>
          <Field
            name="destinationPhoneNumber"
            label="Destination Phone Number"
            type="tel"
            required
          />
        </div>
      </div>
    </Form>
  );
}

ClinicDetails.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  index: PropTypes.number,
  formName: PropTypes.string,
};
