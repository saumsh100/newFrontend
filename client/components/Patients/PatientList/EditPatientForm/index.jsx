import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';
import { maxLength } from '../../../library/Form/validate';
import { languages } from '../../../Settings/Clinic/Address/selectConstants';
export default function EditPatientForm({ onSubmit, formName, styles, currentPatient }) {

  const key = currentPatient.id;
  const initialValues = {
    firstName: currentPatient.firstName,
    lastName: currentPatient.lastName,
    middleName: currentPatient.middleName,
    birthDate: currentPatient.birthDate,
    language: currentPatient.language,
    age: currentPatient.age,
    status: currentPatient.status,
    gender: currentPatient.gender,
  };

  const statusOptions = [
    {
      value: 'Active',
    },
    {
      value: 'InActive',
    }
    ,
  ];

  const gender = [
    {
      value: 'Male',
    },
    {
      value: 'Female',
    }
    ,
  ];

  return (
    <Form
      key={key}
      form={formName}
      onSubmit={onSubmit}
      className={styles.form}
      initialValues={initialValues}
    >
      <div className={styles.names}>
        <div className={styles.userIcon}>
          <i className="fa fa-user" />
        </div>
        <Field
          required
          className={styles.nameFields}
          name="firstName"
          validate={[maxLength(15)]}
          label="First Name"
        />
        <div className={styles.middleField}>
          <Field
            name="middleName"
            className={styles.nameFields}
            validate={[maxLength(15)]}
            label="M"
          />
        </div>
        <Field
          required
          className={styles.nameFields}
          name="lastName"
          validate={[maxLength(15)]}
          label="Last Name"
        />
      </div>

      <div className={styles.names}>
        <div className={styles.calendarIcon}>
          <i className="fa fa-calendar" />
        </div>
        <div className={styles.birthFields}>
          <Field
            required
            className={styles.nameFields}
            component="DayPicker"
            name="birthDate"
            label="Birth Date"
          />
        </div>
        <Field
          required
          className={styles.genderInput}
          name="gender"
          component="DropdownSelect"
          label="Gender"
          options={gender}
        />
      </div>
      <div className={styles.names}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-globe" />
        </div>
        <Field
          className={styles.langaugeInput}
          name="language"
          label="Language"
          component="DropdownSelect"
          options={languages}
        />
      </div>
      <div className={styles.status}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-flag" />
        </div>
        <Field
          required
          className={styles.langaugeInput}
          name="status"
          label="Status"
          component="DropdownSelect"
          options={statusOptions}
        />
      </div>
    </Form>
  );
}

EditPatientForm.propTypes = {
  formName: PropTypes.string,
  styles: PropTypes.object,
  currentPatient: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
