
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSection } from '../../../../library';
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
    theme,
  } = props;

  const practitionerOptions = generatePractitionerOptions(practitioners);

  return (
    <Form
      form="practitioners"
      onChange={handlePractitioners}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.formContainer}>
        <FormSection name="practitioners">
          <div className={styles.formHeader}> Name </div>
          <div className={styles.formContainer_row} >
            <Field
              component="DropdownSelect"
              name="0"
              options={practitionerOptions}
              theme={theme}
              label="Doctor / Hygienist"
            />
          </div>
          {/*<div className={styles.formHeader}> Type </div>
          <div className={styles.formContainer_row} >
            <Field
              component="DropdownSelect"
              name="1"
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
          </div>*/}
        </FormSection>
      </div>
    </Form>
  )
}

Practitioners.propTypes = {
  handlePractitioners: PropTypes.func.isRequired,
  practitioners: PropTypes.object.isRequired,
  theme: PropTypes.object,
}
