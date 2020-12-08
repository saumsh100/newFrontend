
import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, Field } from '../../../../library';
import styles from '../styles.scss';

export default function Communications({ theme }) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}> Last Reminder Sent</div>
      <FormSection name="lastReminder" className={styles.formContainer_row}>
        <Field component="DayPicker" name="0" theme={theme} label="Date" />
        <span className={styles.formContainer_middleText}> to </span>
        <Field component="DayPicker" name="1" theme={theme} label="Date" />
      </FormSection>
      <div className={styles.formHeader}> Last Recare Sent</div>
      <FormSection name="lastRecall" className={styles.formContainer_row}>
        <Field component="DayPicker" name="0" theme={theme} label="Date" />
        <span className={styles.formContainer_middleText}> to </span>
        <Field component="DayPicker" name="1" theme={theme} label="Date" />
      </FormSection>
    </div>
  );
}

Communications.propTypes = { theme: PropTypes.objectOf(PropTypes.string) };

Communications.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};
