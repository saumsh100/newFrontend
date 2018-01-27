
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import { usStates, caProv } from '../../../../Settings/Clinic/Address/selectConstants';
import styles from '../styles.scss';

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
    patient,
    handleSubmit,
    country,
    setCountry,
  } = props;

  const initialValues = {
    gender: patient.get('gender'),
    birthDate: moment(patient.get('birthDate')).format('MM/DD/YYYY'),
    homePhoneNumber: patient.get('homePhoneNumber'),
    mobilePhoneNumber: patient.get('mobilePhoneNumber'),
    workPhoneNumber: patient.get('workPhoneNumber'),
  };

  if (patient.get('address')) {
    const currentPatient = patient.get('address');

    initialValues.street = currentPatient.street;
    initialValues.city = currentPatient.city;
    initialValues.country = currentPatient.country;
    initialValues.zipCode = currentPatient.zipCode;
    initialValues.state = currentPatient.state;
  }

  let states = usStates;

  if (country === 'CA') {
    states = caProv;
  }

  const theme = {
    input: styles.inputBarStyle,
  };

  return (
    <Form
      form="Form2"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <div className={styles.formHeader}> Basic </div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="gender"
              label="Gender"
              component="DropdownSelect"
              options={optionsGender}
              theme={props.dropDownStyle}
            />
          </Col>
          <Col xs={6}>
            <Field
              normalize={normalizeBirthdate}
              validate={[validateBirthdate]}
              name="birthDate"
              label="Birth Date (MM/DD/YYYY)"
              theme={theme}
              icon="birthday-cake"
            />
          </Col>
        </Row>
        <div className={styles.formHeader}> Contact </div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="homePhoneNumber"
              type="tel"
              label="Home Number"
              theme={theme}
              icon="phone"
            />
          </Col>
          <Col xs={6}>
            <Field
              name="mobilePhoneNumber"
              type="tel"
              label="Mobile Number"
              theme={theme}
              icon="mobile"
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="workPhoneNumber"
              type="tel"
              label="Work Number"
              theme={theme}
              icon="phone-square"
            />
          </Col>
        </Row>
        <div className={styles.formHeader}> Address </div>
        <Row className={styles.row}>
          <Col xs={12}>
            <Field
              name="street"
              label="Address Line 1"
              theme={theme}
              icon="map-marker"
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="city"
              label="City"
              theme={theme}
            />
          </Col>
          <Col xs={6} >
            <Field
              name="state"
              label="State"
              component="DropdownSelect"
              options={states}
              theme={props.dropDownStyle}
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="zipCode"
              label="Postal Code"
              maxLength="6"
              theme={theme}
            />
          </Col>
          <Col xs={6} >
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
              theme={props.dropDownStyle}
              onChange={(e, value) => {
                setCountry(value);
              }}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  )
}

PersonalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.object,
  country: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
};
