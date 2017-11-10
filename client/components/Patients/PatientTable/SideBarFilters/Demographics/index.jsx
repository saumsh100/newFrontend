
import React, { PropTypes } from 'react';
import { Form, Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

const optionsGender = [
  { value: 'Male' },
  { value: 'Female' },
];

const optionsCity = [
  { value: 'vancouver' },
];

export default function Demographics(props) {
  const {
    handleDemographics,
  } = props;

  return (
    <Form
      form="demographics"
      onChange={handleDemographics}
      ignoreSaveButton
    >
      <div className={styles.formContainer}>

        <div className={styles.formHeader}> Age </div>
        <FormSection name="age" className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="0"
            options={[{
              label: '18',
              value: 18,
            }]}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DropdownSelect"
            name="1"
            options={[{
              label: '35',
              value: 35,
            }]}
            className={styles.ddSelect}
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
