
import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, Field, Form } from '../../../../library';
import styles from '../styles.scss';

export default function Communications(props) {
  const { handleCommunications, dateTheme } = props;

  return (
    <Form
      form="communications"
      onChange={handleCommunications}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeader}> Last Reminder Sent</div>
        <FormSection name="lastReminderSent" className={styles.formContainer_row}>
          <Field component="DayPicker" name="0" theme={dateTheme} label="Date" />
          <span className={styles.formContainer_middleText}> to </span>
          <Field component="DayPicker" name="1" theme={dateTheme} label="Date" />
        </FormSection>
        <div className={styles.formHeader}> Last Recare Sent</div>
        <FormSection name="lastRecareSent" className={styles.formContainer_row}>
          <Field component="DayPicker" name="0" theme={dateTheme} label="Date" />
          <span className={styles.formContainer_middleText}> to </span>
          <Field component="DayPicker" name="1" theme={dateTheme} label="Date" />
        </FormSection>
        <div className={styles.formHeader}> Reviews</div>
        <FormSection name="reviews" className={styles.formContainer_row}>
          <Field component="DayPicker" name="0" theme={dateTheme} label="Date" />
          <span className={styles.formContainer_middleText}> to </span>
          <Field component="DayPicker" name="1" theme={dateTheme} label="Date" />
        </FormSection>
      </div>
    </Form>
  );
}

Communications.propTypes = {
  handleCommunications: PropTypes.func.isRequired,
  dateTheme: PropTypes.objectOf(PropTypes.string).isRequired,
};
