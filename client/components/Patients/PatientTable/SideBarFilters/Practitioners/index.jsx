
import React, { Component, PropTypes } from 'react';
import { Form, Field } from '../../../../library';
import { SortByFirstName } from '../../../../library/util/SortEntities';

import styles from '../styles.scss';

const generatePractitionerOptions = (practitioners) => {
  const options = [];
  practitioners.sort(SortByFirstName).map((pr) => {
    const label = pr.type === 'Dentist' ? `Dr. ${pr.lastName}` : `${pr.firstName} ${pr.lastName || ''}`;
    options.push({ label, value: pr.id });
  });
  return options;
};

export default function Practitioners(props) {
  const {
    handlePractitioners,
    practitioners,
  } = props;

  const practitionerOptions = generatePractitionerOptions(practitioners);

  return (
    <Form
      form="demographics"
      onChange={handlePractitioners}
      ignoreSaveButton
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeader}> Name </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="name"
            options={practitionerOptions}
            required
          />
        </div>
        <div className={styles.formHeader}> Type </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="type"
            options={[{
              value: 'All Practitioners',
            },{
              value: 'Doctor',
            },{
              value: 'Hygienist',
            }]}
            className={styles.ddSelect}
            required
          />
        </div>
      </div>
    </Form>
  )
}
