
import React, { Component, PropTypes, } from 'react';
import { Row, Col, Form, Field, Select, } from '../../../library';
import { usStates, caProvinces, countrySelector } from './selectConstants';
import { change, }  from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from './styles.scss';

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);

class AddressForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      country: '',
      street: '',
      city: '',
      zipCode: '',
      state: '',
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
    const { accountInfo } = this.props;

    if (accountInfo) {
      this.setState({
        country: accountInfo.get('country'),
        street: accountInfo.get('street'),
        city: accountInfo.get('city'),
        zipCode: accountInfo.get('zipCode'),
        state: accountInfo.get('state'),
      });
    }
  }

  render() {
    const { onSubmit } = this.props;

    let stateProv = (this.state.country === 'United States' ? usStates : caProvinces);
    let zipPostal = (this.state.country === 'United States' ? 'Zipcode' : 'Postal Code');

    return (
      <div className={styles.addressRow}>
        <Form form="addressSettingsForm" onSubmit={onSubmit} initialValues={this.state} >
          <Field
            required
            name="street"
            label="Street"
            validate={[maxLength25]}
          />
          <div className={styles.addressCol}>
          <div className={styles.addressColPlain}>
            <Field
              required
              name="city"
              label="City"
              validate={[maxLength25]}
            />
          </div>
            <div className={styles.addressColSelect}>
              <Field
                required
                name="state"
                label="State"
                component="DropdownSelect"
                options={stateProv}
              />
            </div>
          </div>
          <div className={styles.addressCol}>
          <div className={styles.addressColPlain}>
            <Field
              required
              name="zipCode"
              label={zipPostal}
              validate={[this.zipPostalVal]}
            />
          </div>
            <div className={styles.addressColSelect}>
              <Field
                name="country"
                label="Country"
                component="DropdownSelect"
                options={countrySelector}
                onChange={this.changeCountry}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

AddressForm.propTypes = {
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
