import React, { PropTypes } from 'react';
import { Form, Field } from '../../../../library';
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
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="ageStart"
            label="Years"
            options={[{
              label: '18',
              value: 18,
            }]}
            required
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DropdownSelect"
            name="ageEnd"
            label="Years"
            options={[{
              label: '35',
              value: 35,
            }]}
            className={styles.ddSelect}
            required
          />
        </div>
        <div className={styles.formHeader}> Gender </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="gender"
            label="Gender"
            options={optionsGender}
            className={styles.ddSelect}
            required
          />
        </div>
        <div className={styles.formHeader}> Location </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="city"
            label="City"
            options={optionsCity}
            className={styles.ddSelect}
            required
          />
        </div>
      </div>
    </Form>
  );
}
