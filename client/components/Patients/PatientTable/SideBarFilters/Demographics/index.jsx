
import React from 'react';
import { Field, FormSection } from '../../../../library';
import TextField from '../FilterForm/Fields/TextField';
import { notNegative, parseNum } from '../../../../library/Form/validate';
import styles from '../styles.scss';

const optionsGender = [{ value: 'Male' }, { value: 'Female' }];

const optionsCity = [
  { value: 'Calgary' },
  { value: 'Edmonton' },
  { value: 'Fredericton' },
  { value: 'Halifax' },
  { value: 'Montreal' },
  { value: 'Quebec' },
  { value: 'Regina' },
  { value: 'Saskatoon' },
  { value: 'St.John' },
  { value: 'Toronto' },
  { value: 'Vancouver' },
  { value: 'Victoria' },
  { value: 'Winnipeg' },
];

const optionsStatus = [{ value: 'Active' }, { value: 'Inactive' }];

const theme = {
  filled: styles.filledLabelStyle,
  group: styles.groupInputStyle2,
};

const DemographicsForm = () => (
  <div className={styles.formContainer}>
    <div className={styles.formHeader}> Search By First Name</div>
    <TextField name="firstName" data-test-id="search_firstName" />
    <div className={styles.formHeader}> Search By Last Name</div>
    <TextField name="lastName" data-test-id="search_lastName" />
    <div className={styles.formHeader}> Age</div>
    <FormSection name="age" className={styles.formContainer_row}>
      <Field
        name="0"
        type="number"
        validate={[notNegative]}
        normalize={parseNum}
        data-test-id="ageInput_0"
        label="Years"
        theme={theme}
      />
      <span className={styles.formContainer_middleText}> to </span>
      <Field
        name="1"
        type="number"
        validate={[notNegative]}
        normalize={parseNum}
        data-test-id="ageInput_1"
        label="Years"
        theme={theme}
      />
    </FormSection>
    <div className={styles.formHeader}> Gender</div>
    <div className={styles.formContainer_row}>
      <Field
        component="DropdownSelect"
        name="gender"
        options={optionsGender}
        className={styles.ddSelect}
        label="All"
        theme={theme}
        data-test-id="genderInput"
      />
    </div>
    <div className={styles.formHeader}> Location</div>
    <div className={styles.formContainer_row}>
      <Field
        component="DropdownSelect"
        name="city"
        options={optionsCity}
        className={styles.ddSelect}
        label="City"
        theme={theme}
      />
    </div>
    <div className={styles.formHeader}> Status</div>
    <div className={styles.formContainer_row}>
      <Field
        component="DropdownSelect"
        name="status"
        options={optionsStatus}
        className={styles.ddSelect}
        label="All"
        theme={theme}
      />
    </div>
  </div>
);

export default DemographicsForm;
