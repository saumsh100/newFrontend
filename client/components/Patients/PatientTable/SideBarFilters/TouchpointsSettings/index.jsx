
import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

const booleanOptions = [
  {
    label: 'Sent',
    value: 'true',
  },
  {
    label: 'Not Sent',
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
const Touchpoints = ({ theme, fieldName, timezone }) => (
  <div className={styles.formContainer}>
    <FormSection name={fieldName}>
      <div className={styles.formHeader}>Status</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="0" options={booleanOptions} theme={theme} />
      </div>
      <div className={styles.formHeader}>Sender</div>
      <div className={styles.formContainer_row}>
        <Field component="DropdownSelect" name="1" options={senderOptions} theme={theme} />
      </div>
      <div className={styles.formHeader}>Date Sent</div>
      <div className={styles.formContainer_row}>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="2"
          theme={theme}
          label="Date"
        />
        <span className={styles.formContainer_middleText}> to </span>
        <Field
          component="DayPickerWithHelpers"
          timezone={timezone}
          name="3"
          theme={theme}
          label="Date"
        />
      </div>
    </FormSection>
  </div>
);

Touchpoints.propTypes = {
  theme: PropTypes.objectOf(PropTypes.string),
  fieldName: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};

Touchpoints.defaultProps = {
  theme: {
    filled: styles.filledLabelStyle,
    label: styles.dateLabelStyle,
    group: styles.groupInputStyle,
  },
};

export default Touchpoints;
