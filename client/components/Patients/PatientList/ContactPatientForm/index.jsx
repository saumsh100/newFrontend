import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import { languages, countrySelector, usStates, caProvinces } from '../../../Settings/Clinic/Address/selectConstants';
import classNames from 'classnames';
import { maxLength, emailValidate, phoneValidate, postalCodeValidate, phoneValidateNullOkay } from '../../../library/Form/validate';

export default function ContactPatientForm({ onSubmit, formName, styles, currentPatient }) {

  const key = currentPatient.id;

  const initialValues = {
    email: currentPatient.email,
    homePhoneNumber: currentPatient.homePhoneNumber,
    mobilePhoneNumber: currentPatient.mobilePhoneNumber,
    workPhoneNumber: currentPatient.workPhoneNumber,
  };

  if (currentPatient.address) {
    initialValues.street = currentPatient.address.street;
    initialValues.city = currentPatient.address.city;
    initialValues.country = currentPatient.address.country;
    initialValues.postalCode = currentPatient.address.postalCode;
    initialValues.province = currentPatient.address.province;
  }

  function submit(values) {
    values.address = {};
    values.address.postalCode = values.postalCode;
    values.address.country = values.country;
    values.address.city = values.city;
    values.address.street = values.street;
    values.address.province = values.province;
    onSubmit(values);
  }


  const prov = [...caProvinces, ...usStates];

  return (
    <Form
      key={key}
      form={formName}
      onSubmit={submit}
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
            name="homePhoneNumber"
            className={styles.nameFields}
            type="tel"
            label="Home #"
          />
        </div>
      </div>
      <div className={styles.names2}>
        <div className={styles.mailIcon}>
          <i />
        </div>
        <div className={styles.firstField}>
          <Field
            name="mobilePhoneNumber"
            className={styles.nameFields}
            type="tel"
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
            name="workPhoneNumber"
            className={styles.nameFields}
            type="tel"
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
            validate={[maxLength(40)]}
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
          className={classNames(styles.genderInput, 'dropDownOverwrite')}
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
