import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import { languages, countrySelector, usStates, caProvinces } from '../../../Settings/Clinic/Address/selectConstants';
import { maxLength, emailValidate, phoneValidate, postalCodeValidate, phoneValidateNullOkay } from '../../../library/Form/validate';

export default function ContactPatientForm({ onSubmit, formName, styles, currentPatient }) {

  const key = currentPatient.id;


  const initialValues = {
    email: currentPatient.email,
    phoneNumber: currentPatient.phoneNumber,
    mobileNumber: currentPatient.mobileNumber,
    workNumber: currentPatient.workNumber,
  };

  if (currentPatient.address) {
    initialValues.street = currentPatient.address.street;
    initialValues.city = currentPatient.address.city;
    initialValues.country = currentPatient.address.country;
    initialValues.postalCode = currentPatient.address.postalCode;
    initialValues.province = currentPatient.address.province;
  }

  const gender = [
    {
      value: 'Male',
    },
    {
      value: 'Female',
    }
    ,
  ];

  const prov = [...usStates, ...caProvinces];
  return (
    <Form
      key={key}
      form={formName}
      onSubmit={onSubmit}
      className={styles.form}
      initialValues={initialValues}
    >
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i className="fa fa-envelope" />
        </div>
        <div className={styles.firstField}>
          <Field
            name="email"
            className={styles.nameFields}
            validate={[emailValidate]}
            label="Email"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i className="fa fa-phone" />
        </div>
        <div className={styles.firstField}>
          <Field
            name="phoneNumber"
            className={styles.nameFields}
            validate={[phoneValidate]}
            label="Phone #"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i />
        </div>
        <div className={styles.firstField}>
          <Field
            name="mobileNumber"
            className={styles.nameFields}
            validate={[phoneValidateNullOkay]}
            label="Mobile #"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i />
        </div>
        <div className={styles.firstField}>
          <Field
            name="workNumber"
            className={styles.nameFields}
            validate={[phoneValidateNullOkay]}
            label="Work #"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i className="fa fa-home" />
        </div>
        <div className={styles.firstField}>
          <Field
            name="street"
            className={styles.nameFields}
            validate={[maxLength(25)]}
            label="Street"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.noIcon}>
          <i />
        </div>
        <div className={styles.birthFields}>
          <Field
            className={styles.nameFields}
            name="city"
            validate={[maxLength(15)]}
            label="City"
          />
        </div>
        <Field
          className={styles.genderInput}
          name="province"
          component="DropdownSelect"
          label="Province"
          options={prov}
        />
      </div>
      <div className={styles.names2}>
        <div className={styles.noIcon2}>
          <i />
        </div>
        <Field
          className={styles.countryInput}
          name="country"
          component="DropdownSelect"
          label="Country"
          options={countrySelector}
        />
        <div className={styles.birthFields}>
          <Field
            className={styles.nameFields}
            name="postalCode"
            validate={[postalCodeValidate]}
            label="Postal Code"
          />
        </div>
      </div>
    </Form>
  );
}

ContactPatientForm.propTypes = {
  formName: PropTypes.string,
  styles: PropTypes.object,
  currentPatient: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
