
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import {
  usStates,
  caProv,
} from '../../../../Settings/Practice/General/Address/selectConstants';
import styles from '../styles.scss';
import { asyncValidateNewPatient } from '../../../../library/Form/validate';
import { isResponsive } from '../../../../../util/hub';
import PatientModel from '../../../../../entities/models/Patient';

const normalizeBirthdate = value => value.trim();

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value)) {
    return format;
  }
  const date = moment(value, format);
  const isValid = date.isValid();
  if (!isValid) {
    return format;
  }
  return undefined;
};

const validateZipcodePostal = (value, country) => {
  if (!value) return undefined;

  const regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);

  if (country === 'US') {
    return value && /^\d{5}(-\d{4})?$/.test(value)
      ? undefined
      : 'This is not a valid zip code.';
  } else if (!regex.test(value)) {
    return 'This is not a valid postal code.';
  }

  return undefined;
};

const optionsGender = [{ value: 'Male' }, { value: 'Female' }];

const countries = [
  {
    value: 'CA',
    label: 'Canada',
  },
  {
    value: 'US',
    label: 'United States',
  },
];

export default function PersonalForm(props) {
  const {
    patient, handleSubmit, country, setCountry, inputStyle,
  } = props;

  const initialValues = {
    gender: patient.get('gender'),
    birthDate: moment(patient.get('birthDate')).format('MM/DD/YYYY'),
    homePhoneNumber: patient.get('homePhoneNumber'),
    mobilePhoneNumber: patient.get('mobilePhoneNumber'),
    workPhoneNumber: patient.get('workPhoneNumber'),
    email: patient.get('email'),
    firstName: patient.get('firstName'),
    lastName: patient.get('lastName'),
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

  const theme = inputStyle;

  return (
    <Form
      form="Form2"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      initialValues={initialValues}
      asyncValidate={asyncValidateNewPatient}
      asyncBlurFields={['email', 'mobilePhoneNumber']}
      ignoreSaveButton={!isResponsive()}
    >
      <Grid className={styles.grid}>
        <div className={styles.formHeader}> Basic </div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field name="firstName" label="First Name" theme={theme} />
          </Col>
          <Col xs={6}>
            <Field name="lastName" label="Last Name" theme={theme} />
          </Col>
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
              label={isResponsive() ? 'Birth Date ' : 'Birth Date (MM/DD/YYYY)'}
              theme={theme}
            />
          </Col>
        </Row>
        <div className={styles.formHeader}> Address </div>
        <Row className={styles.row}>
          <Col xs={12}>
            <Field name="street" label="Address Line 1" theme={theme} />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field name="city" label="City" theme={theme} />
          </Col>
          <Col xs={6}>
            <Field
              name="country"
              label="Country"
              component="DropdownSelect"
              options={countries}
              theme={props.dropDownStyle}
              onChange={(e, value) => {
                setCountry(value);
              }}
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="zipCode"
              label={isResponsive() ? 'Zip Code' : 'Postal Code / Zip Code'}
              maxLength="6"
              theme={theme}
              validate={[value => validateZipcodePostal(value, country)]}
            />
          </Col>
          <Col xs={6}>
            <Field
              name="state"
              label="State"
              component="DropdownSelect"
              options={states}
              theme={props.dropDownStyle}
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
            />
          </Col>
          <Col xs={6}>
            <Field
              name="mobilePhoneNumber"
              type="tel"
              label="Mobile Number"
              theme={theme}
            />
          </Col>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="workPhoneNumber"
              type="tel"
              label="Work Number"
              theme={theme}
            />
          </Col>
          <Col xs={6}>
            <Field name="email" label="Email" theme={theme} />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

PersonalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.instanceOf(PatientModel),
  country: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  inputStyle: PropTypes.string,
  dropDownStyle: PropTypes.string,
};
