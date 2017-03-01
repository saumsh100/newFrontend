
import React from 'react';
import { Grid, Row, Col, Form, Field, Button, Select } from '../../../library';



const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const maxLength20 = maxLength(20);

const zipTest = value =>
  value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'Please enter a proper zipcode.';



export default function AddressForm({ onSubmit, accountInfo }) {

  const initialValues = {
    street: accountInfo.get('street'),
    city: accountInfo.get('city'),
    state: accountInfo.get('state'),
    zipCode: accountInfo.get('zipCode'),
    country: accountInfo.get('country'),
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
            validate={[maxLength20]}
          />
        </Col>
        <Col xs={6}>
          <Field
            required
            name="state"
            label="State"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Field
            required
            name="zipCode"
            label="Zipcode"
            validate={[zipTest]}
          />
        </Col>
        <Col xs={6}>
          <Field
            required
            name="country"
            label="Country"
          />
        </Col>
      </Row>
      <Button type="submit" >Save</Button>
    </Form>
  );
}
