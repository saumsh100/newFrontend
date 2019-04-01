
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

const booleanOptions = [
  {
    label: 'Any',
    value: 'null',
  },
  {
    label: 'Not Completed',
    value: 'false',
  },
  {
    label: 'Completed',
    value: 'true',
  },
];

const FollowUps = ({ theme, timezone }) => (
  <div className={styles.formContainer}>
    <FormSection name="patientFollowUps">
      <div className={styles.formHeader}>Status</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="0" options={booleanOptions} theme={theme} />
      </div>
      <div className={styles.formHeader}>Date</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="1"
          theme={theme}
          label="Date"
        />
        <span className={styles.formContainer_middleText}> to </span>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="2"
          theme={theme}
          label="Date"
        />
      </div>
    </FormSection>
  </div>
);

FollowUps.propTypes = {
  theme: PropTypes.objectOf(PropTypes.string),
  timezone: PropTypes.string.isRequired,
};

FollowUps.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};

export default FollowUps;
