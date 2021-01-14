
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, getTimezoneList } from '../../../../library/index';
import { usStates, caProvinces, countrySelector } from './selectConstants';
import styles from './styles.scss';

const maxLength = max => value =>
  (value && value.length > max
    ? `Must be ${max} characters or less, and no blank spaces`
    : undefined);
const maxLength25 = maxLength(25);
const maxPostalLength = maxLength(7);

/**
 * setLabel decides which element to render based on a default condition.
 * @param country
 * @param primary
 * @param secondary
 */
const setLabel = (country, primary, secondary) => (country === 'US' ? primary : secondary);

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.changeCountry = this.changeCountry.bind(this);
    this.zipPostalVal = this.zipPostalVal.bind(this);
  }

  getInitialState() {
    const { address } = this.props;
    const country = address.get('country');
    const zipPostal = setLabel(country, 'ZipCode', 'Postal Code');
    const labelStateProv = setLabel(country, 'State', 'Province');

    return {
      country,
      zipPostal,
      labelStateProv,
    };
  }

  changeCountry(_event, newValue) {
    this.props.change('addressSettingsForm', 'zipCode', '');
    this.props.change('addressSettingsForm', 'state', '');

    const zipPostal = setLabel(newValue, 'Zipcode', 'Postal Code');
    const labelStateProv = setLabel(newValue, 'State', 'Province');

    this.setState({
      country: newValue,
      zipPostal,
      labelStateProv,
    });
  }

  zipPostalVal(value) {
    if (!value) {
      return undefined;
    }
    const regex = new RegExp(
      /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
    );

    if (this.state.country === 'US') {
      return value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'Please enter a proper zipcode.';
    }

    if (!regex.test(value)) {
      return 'Please enter a proper postal code.';
    }

    return undefined;
  }

  render() {
    const { onSubmit, address } = this.props;

    const stateProv = setLabel(this.state.country, usStates, caProvinces);

    const initialValues = {
      country: address.get('country'),
      street: address.get('street'),
      city: address.get('city'),
      zipCode: address.get('zipCode'),
      state: address.get('state'),
      timezone: address.get('timezone'),
    };

    const options = getTimezoneList({ showOffset: true });
    return (
      <div className={styles.addressRow}>
        <Form
          enableReinitialize
          form="addressSettingsForm"
          onSubmit={onSubmit}
          initialValues={initialValues}
          data-test-id="addressSettingsForm"
        >
          <div className={styles.addressForm}>
            <Field name="street" label="Street Address" data-test-id="street" />
            <Field
              name="country"
              label="Country"
              component="DropdownSelect"
              options={countrySelector}
              onChange={this.changeCountry}
              data-test-id="country"
            />
            <Field
              name="state"
              label={this.state.labelStateProv}
              component="DropdownSelect"
              options={stateProv}
              data-test-id="state"
            />
            <Field name="city" label="City" validate={[maxLength25]} data-test-id="city" />
            <Field
              name="zipCode"
              label={this.state.zipPostal}
              validate={[maxPostalLength, this.zipPostalVal]}
              data-test-id="zipCode"
            />
            <Field
              name="timezone"
              label="Timezone"
              component="DropdownSelect"
              options={options}
              data-test-id="timezone"
            />
          </div>
        </Form>
      </div>
    );
  }
}

AddressForm.propTypes = {
  address: PropTypes.instanceOf(Map),
  change: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

AddressForm.defaultProps = {
  address: null,
};

export default AddressForm;
