
import React, { Component, PropTypes, } from 'react';
import moment from 'moment-timezone';
import { Row, Col, Form, Field, Select, } from '../../../library';
import { usStates, caProvinces, countrySelector } from './selectConstants';
import { change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './styles.scss';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less, and no blank spaces` : undefined
const maxLength25 = maxLength(25);
const maxPostalLength = maxLength(6);

class AddressForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      country: '',
      street: '',
      city: '',
      zipCode: '',
      state: '',
      timezone: ''
    }
    this.changeCountry = this.changeCountry.bind(this);
    this.zipPostalVal = this.zipPostalVal.bind(this)
  }

  changeCountry(event, newValue, previousValue) {
    this.props.change('addressSettingsForm', 'zipCode', '');
    this.props.change('addressSettingsForm', 'state', '');

    this.setState({
      country: newValue,
    });
  }

  zipPostalVal(value) {
    const regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);

    if(this.state.country === 'United States') {
      return value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'Please enter a proper zipcode.';
    } else if (!regex.test(value)) {
      return 'Please enter a proper postal code.';
    }

    return undefined;
  }

  componentWillMount() {
    const { accountInfo, address } = this.props;
    if (address) {
      this.setState({
        country: address.get('country'),
        street: address.get('street'),
        city: address.get('city'),
        zipCode: address.get('zipCode'),
        state: address.get('state'),
        timezone: address.get('timezone'),
      });
    }
  }

  render() {
    const { onSubmit } = this.props;

    let stateProv = (this.state.country === 'United States' ? usStates : caProvinces);
    let zipPostal = (this.state.country === 'United States' ? 'Zipcode' : 'Postal Code');

    const options = moment.tz.names().map((value) => {
      const exp = new RegExp(/america/i);
      if (exp.test(value)) {
        return {
          value,
        };
      }
      return {
        value: null,
      };
    }).filter(filterValue => filterValue.value !== null);

    return (
      <div className={styles.addressRow}>
        <Form
          form="addressSettingsForm"
          onSubmit={onSubmit}
          initialValues={this.state}
          data-test-id="addressSettingsForm"
          alignSave="left"
        >
          <div className={styles.addressForm}>
            <Field
              required
              name="street"
              label="Street Address"
              validate={[maxLength25]}
              data-test-id="street"
            />
            <Field
              name="country"
              label="Country"
              component="DropdownSelect"
              options={countrySelector}
              onChange={this.changeCountry}
              data-test-id="country"
            />
            <Field
              required
              name="state"
              label="State"
              component="DropdownSelect"
              options={stateProv}
              data-test-id="state"
            />
            <Field
              required
              name="city"
              label="City"
              validate={[maxLength25]}
              data-test-id="city"
            />
            <Field
              required
              name="zipCode"
              label={zipPostal}
              validate={[maxPostalLength, this.zipPostalVal]}
              data-test-id="zipCode"
              maxLength="6"
            />
            <Field
              name="timezone"
              label="Timezone"
              component="DropdownSelect"
              options={options}
              data-test-id="timezone"
              search
            />
          </div>
        </Form>
      </div>
    );
  }
}

AddressForm.propTypes = {
  address: PropTypes.object,
  change: PropTypes.func,
  onSubmit: PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    change,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddressForm);
