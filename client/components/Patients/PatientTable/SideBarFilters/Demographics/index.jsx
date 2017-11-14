
import React, { PropTypes } from 'react';
import { Form, Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

const optionsGender = [
  { value: 'Male' },
  { value: 'Female' },
];

const optionsCity = [
  { value: 'Vancouver' },
  { value: 'Victoria' },
  { value: 'Edmonton' },
  { value: 'Calgary' },
  { value: 'Regina' },
  { value: 'Saskatoon' },
  { value: 'Winnipeg' },
  { value: 'Quebec' },
  { value: 'Montreal' },
  { value: 'Halifax' },
  { value: 'St.John' },
  { value: 'Fredericton' },
  { value: 'Toronto' },
];


const parseNum = value => value && parseInt(value);

const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;

export default function Demographics(props) {
  const {
    handleDemographics,
  } = props;

  return (
    <Form
      form="demographics"
      onChange={handleDemographics}
      ignoreSaveButton
      keepDirtyOnReinitialize
    >
      <div className={styles.formContainer}>

        <div className={styles.formHeader}> Age </div>
        <FormSection name="age" className={styles.formContainer_row} >
          <Field
            name="0"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
            icon="birthday-cake"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            name="1"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
            icon="birthday-cake"
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
          />
          </div>
        </FormSection>

      </div>
    </Form>
  );
}
