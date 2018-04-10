
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSection } from '../../../../library';
import styles from '../styles.scss';
import SearchPatientTable from '../SearchPatientTable';

const optionsGender = [
  { value: 'Male' },
  { value: 'Female' },
];

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

const optionsStatus = [
  { value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
];

const parseNum = value => value && parseInt(value);

const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;

export default function Demographics(props) {
  const {
    handleDemographics,
    searchPatients,
  } = props;

  const theme = {
    filled: styles.filledLabelStyle,
    group: styles.groupInputStyle2,
  };

  return (
      <Form
        form="demographics"
        onChange={handleDemographics}
        ignoreSaveButton
        destroyOnUnmount={false}
        data-test-id="demographics"
      >
        <div className={styles.formContainer}>
          <div className={styles.formHeader}> Search By First Name </div>
          <FormSection name="firstName" className={styles.formContainer_row} >
            <SearchPatientTable data-test-id="search_firstName" />
          </FormSection>
          <div className={styles.formHeader}> Search By Last Name </div>
          <FormSection name="lastName" className={styles.formContainer_row}>
            <SearchPatientTable data-test-id="search_lastName" />
          </FormSection>
          <div className={styles.formHeader}> Age </div>
          <FormSection name="age" className={styles.formContainer_row} >
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

          <div className={styles.formHeader}> Gender </div>
          <FormSection name="gender" >
            <div className={styles.formContainer_row}>
              <Field
                component="DropdownSelect"
                name="0"
                options={optionsGender}
                className={styles.ddSelect}
                label="All"
                theme={theme}
                data-test-id="genderInput"
              />
            </div>
          </FormSection>

          <div className={styles.formHeader}> Location </div>
          <FormSection name="city" >
            <div className={styles.formContainer_row}>
              <Field
                component="DropdownSelect"
                name="0"
                options={optionsCity}
                className={styles.ddSelect}
                label="City"
                theme={theme}
              />
            </div>
          </FormSection>

          <div className={styles.formHeader}> Status </div>
          <FormSection name="status" >
            <div className={styles.formContainer_row}>
              <Field
                component="DropdownSelect"
                name="0"
                options={optionsStatus}
                className={styles.ddSelect}
                label="All"
                theme={theme}
              />
            </div>
          </FormSection>
        </div>
      </Form>
  );
}

Demographics.propTypes = {
  handleDemographics: PropTypes.func.isRequired,
}
