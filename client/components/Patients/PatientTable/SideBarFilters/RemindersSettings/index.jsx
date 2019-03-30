
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

const booleanOptions = [
  {
    label: 'Received',
    value: 'true',
  },
  {
    label: 'Not Received',
    value: 'false',
  },
];

const senderOptions = [
  {
    label: 'Any',
    value: 'null',
  },
  {
    label: 'Donna',
    value: 'true',
  },
  {
    label: 'Personal',
    value: 'false',
  },
];
const Reminders = ({ theme }) => (
  <div className={styles.formContainer}>
    <FormSection name="sentReminder">
      <div className={styles.formHeader}>Status</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="0" options={booleanOptions} theme={theme} />
      </div>
      <div className={styles.formHeader}>Sender</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="1" options={senderOptions} theme={theme} />
      </div>
      <div className={styles.formHeader}>Date</div>
      <div className={styles.formContainer_row}>
        <Field component="DayPickerWithHelpers" name="2" theme={theme} label="Date" />
        <span className={styles.formContainer_middleText}> to </span>
        <Field component="DayPickerWithHelpers" name="3" theme={theme} label="Date" />
      </div>
    </FormSection>
  </div>
);

Reminders.propTypes = { theme: PropTypes.objectOf(PropTypes.string) };

Reminders.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};

export default Reminders;
