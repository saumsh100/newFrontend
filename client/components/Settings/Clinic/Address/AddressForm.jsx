
import React, { Component } from 'react';
import { Grid, Row, Col, Form, Field, Button, Select } from '../../../library';
import { usStates, caProvinces, countrySelector } from './statesProvinces';
import { SubmissionError, change, }  from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


class AddressForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      country: '',
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
    if(this.state.country === 'United States'){
      return value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'Please enter a proper zipcode.';
    }else if (!regex.test(value)) {
      return 'Please enter a proper postal code.';
    }
    return undefined;
  }

  componentWillMount() {
    const { accountInfo } = this.props;
    this.setState({
      country: accountInfo.get('country'),
    });
  }

  render() {

    const { onSubmit, accountInfo } = this.props;

    let stateProv = (this.state.country === 'United States' ? usStates : caProvinces);
    let zipPostal = (this.state.country === 'United States' ? 'Zipcode' : 'Postal Code');

    const initialValues = {
      street: accountInfo.get('street'),
      city: accountInfo.get('city'),
      zipCode: accountInfo.get('zipCode'),
      country: this.state.country,
      state: accountInfo.get('state')
    }

    return (
      <Form form="addressSettingsForm" onSubmit={onSubmit}  initialValues={initialValues} >
        <Field
          required
          name="street"
          label="Street"
        />
        <Row>
          <Col xs={6}>
            <Field
              required
              name="city"
              label="City"
            />
          </Col>
          <Col xs={6}>
            <Field
              required
              name="state"
              label="State"
              component="DropdownSelect"
              options={stateProv}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <Field
              required
              name="zipCode"
              label={zipPostal}
              validate={[this.zipPostalVal]}
            />
          </Col>
          <Col xs={6}>
            <Field
              name="country"
              label="Country"
              component="DropdownSelect"
              options={countrySelector}
              onChange={this.changeCountry}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    change,
    focus,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(AddressForm);
