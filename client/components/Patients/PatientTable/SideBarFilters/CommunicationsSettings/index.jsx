
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '../../../../library';
import styles from '../styles.scss';

const booleanOptions = [
  {
    label: 'On',
    value: 'true',
  },
  {
    label: 'Off',
    value: 'false',
  },
];

const Communications = ({ theme }) => (
  <div className={styles.formContainer_flex}>
    <div className={styles.formContainer_column}>
      <div className={styles.formHeader}>Recalls</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="recallCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="recallCommunicationPreferenceInput"
        />
      </div>
      <div className={styles.formHeader}>Reminders</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="reminderCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="reminderCommunicationPreferenceInput"
        />
      </div>
      <div className={styles.formHeader}>Reviews</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="reviewCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="reviewCommunicationPreferenceInput"
        />
      </div>
    </div>
    <div className={styles.formContainer_column}>
      <div className={styles.formHeader}>Email</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="emailCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="emailCommunicationPreferenceInput"
        />
      </div>
      <div className={styles.formHeader}>SMS</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="smsCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="smsCommunicationPreferenceInput"
        />
      </div>
      <div className={styles.formHeader}>Phone</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DropdownSelect"
          name="phoneCommunicationPreference"
          options={booleanOptions}
          className={styles.ddSelect}
          label="All"
          theme={theme}
          data-test-id="phoneCommunicationPreferenceInput"
        />
      </div>
    </div>
  </div>
);

Communications.propTypes = { theme: PropTypes.objectOf(PropTypes.string) };

Communications.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};

export default Communications;
