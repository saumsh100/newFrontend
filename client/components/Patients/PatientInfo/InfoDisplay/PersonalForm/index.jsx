
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import { usStates } from '../../../../Settings/Clinic/Address/selectConstants';
import styles from './styles.scss';

const normalizeBirthdate = (value) => {
  return value.trim();
};

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value)) {
    return format;
  } else {
    const date = moment(value, format);
    const isValid = date.isValid();
    if (!isValid) {
      return format;
    }
  }
};

const optionsGender = [
  { value: 'Male' },
  { value: 'Female' },
];

export default function PersonalForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="personForm"
      onSubmit={handleSubmit}
      className={styles.formContainer}
    >
      <Grid className={styles.grid}>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              required
              name="gender"
              label="Gender"
              component="DropdownSelect"
              options={optionsGender}
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colSelect}>
            <Field
              required
              normalize={normalizeBirthdate}
              validate={[validateBirthdate]}
              name="birthDate"
              label="Birth Date (MM/DD/YYYY)"
              data-test-id="birthDate"
              theme="primaryBlue"
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="homePhoneNumber"
              type="tel"
              label="Home Number"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} >
            <Field
              name="mobilePhoneNumber"
              type="tel"
              label="Mobile Number"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="workPhoneNumber"
              type="tel"
              label="Work Number"
              theme="primaryBlue"
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="address1"
              label="Address Line 1"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6}>
            <Field
              name="address2"
              label="Address Line 2"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="city"
              label="City"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colSelect}>
            <Field
              required
              name="state"
              label="State"
              component="DropdownSelect"
              options={usStates}
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="zipCode"
              label="Postal Code"
              maxLength="6"
              required
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colSelect}>
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
              required
              theme="primaryBlue"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  )
}
