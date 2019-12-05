
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { touch } from 'redux-form';
import { dateFormatter, isValidEmail } from '@carecru/isomorphic';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import { usStates, caProv } from '../../../../Settings/Practice/General/Address/selectConstants';
import { isResponsive } from '../../../../../util/hub';
import PatientModel from '../../../../../entities/models/Patient';
import styles from '../styles.scss';

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

  const regex = new RegExp(
    /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
  );

  if (country === 'US') {
    return value && /^\d{5}(-\d{4})?$/.test(value) ? undefined : 'This is not a valid zip code.';
  } else if (!regex.test(value)) {
    return 'This is not a valid postal code.';
  }

  return undefined;
};

const validateEmail = (value) => {
  if (!value) return undefined;

  if (isValidEmail(value)) {
    return undefined;
  }
  return 'This is not a valid email address.';
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

const FORM_NAME = 'Form2';

class PersonalForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handlePreSubmit = this.handlePreSubmit.bind(this);
  }

  componentDidMount() {
    this.props.touch(FORM_NAME, 'zipCode');
  }

  handlePreSubmit(data) {
    const { handleSubmit } = this.props;

    const values = {
      ...data,
      mobilePhoneNumber: data.mobilePhoneNumber || null,
      isSyncedWithPms: false,
      address: {
        zipCode: data.zipCode,
        country: data.country,
        city: data.city,
        street: data.street,
        state: data.state,
      },
    };

    return handleSubmit(values);
  }

  render() {
    const { patient, country, setCountry, inputStyle, dropDownStyle } = this.props;

    const birthDate = patient.get('birthDate');
    const isValidBirthDate = moment(birthDate).isValid()
      ? dateFormatter(birthDate, '', 'MM/DD/YYYY')
      : '';

    const initialValues = {
      gender: patient.get('gender'),
      birthDate: isValidBirthDate,
      homePhoneNumber: patient.get('homePhoneNumber'),
      mobilePhoneNumber: patient.get('mobilePhoneNumber'),
      otherPhoneNumber: patient.get('otherPhoneNumber'),
      workPhoneNumber: patient.get('workPhoneNumber'),
      email: patient.get('email'),
      firstName: patient.get('firstName'),
      lastName: patient.get('lastName'),
      zipCode: '',
      country: '',
      city: '',
      street: '',
      state: '',
      ...patient.get('address'),
    };

    const states = country === 'CA' ? caProv : usStates;

    return (
      <Form
        form={FORM_NAME}
        onSubmit={this.handlePreSubmit}
        className={styles.formContainer}
        initialValues={initialValues}
        ignoreSaveButton={!isResponsive()}
      >
        <Grid className={styles.grid}>
          <div className={styles.formHeader}> Basic</div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field name="firstName" label="First Name" theme={inputStyle} />
            </Col>
            <Col xs={6}>
              <Field name="lastName" label="Last Name" theme={inputStyle} />
            </Col>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="gender"
                label="Gender"
                component="DropdownSelect"
                options={optionsGender}
                theme={dropDownStyle}
              />
            </Col>
            <Col xs={6}>
              <Field
                normalize={normalizeBirthdate}
                validate={[validateBirthdate]}
                name="birthDate"
                label={isResponsive() ? 'Birth Date ' : 'Birth Date (MM/DD/YYYY)'}
                theme={inputStyle}
              />
            </Col>
          </Row>
          <div className={styles.formHeader}> Address</div>
          <Row className={styles.row}>
            <Col xs={12}>
              <Field name="street" label="Address Line 1" theme={inputStyle} />
            </Col>
            <Col xs={6} className={styles.colLeft}>
              <Field name="city" label="City" theme={inputStyle} />
            </Col>
            <Col xs={6}>
              <Field
                name="country"
                label="Country"
                component="DropdownSelect"
                options={countries}
                theme={dropDownStyle}
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
                theme={inputStyle}
                validate={[
                  (value, { country: countryForm }) => validateZipcodePostal(value, countryForm),
                ]}
              />
            </Col>
            <Col xs={6}>
              <Field
                name="state"
                label="State"
                component="DropdownSelect"
                options={states}
                theme={dropDownStyle}
              />
            </Col>
          </Row>
          <div className={styles.formHeader}> Contact</div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field name="mobilePhoneNumber" type="tel" label="Mobile Number" theme={inputStyle} />
            </Col>
            <Col xs={6}>
              <Field
                name="otherPhoneNumber"
                type="tel"
                label="Other Phone Number"
                theme={inputStyle}
              />
            </Col>
            <Col xs={6} className={styles.colLeft}>
              <Field name="homePhoneNumber" type="tel" label="Home Number" theme={inputStyle} />
            </Col>
            <Col xs={6}>
              <Field name="workPhoneNumber" type="tel" label="Work Number" theme={inputStyle} />
            </Col>
            <Col xs={12}>
              <Field
                validate={[validateEmail]}
                type="email"
                name="email"
                label="Email"
                theme={inputStyle}
              />
            </Col>
          </Row>
        </Grid>
      </Form>
    );
  }
}

PersonalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  patient: PropTypes.instanceOf(PatientModel),
  country: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  inputStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
  dropDownStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.objectOf(PropTypes.string)]),
  touch: PropTypes.func.isRequired,
};

PersonalForm.defaultProps = {
  patient: null,
  country: '',
  inputStyle: '',
  dropDownStyle: '',
};

const mapDispatchToProps = dispatch => bindActionCreators({ touch }, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(PersonalForm);
