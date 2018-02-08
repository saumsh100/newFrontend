
import React from 'react';
import PropTypes from 'prop-types';
import { FormSection, Field, Form } from '../../../../library';
import styles from '../styles.scss';

export default function Communications(props) {
  const {
    handleCommunications,
    theme,
  } = props;

  return (
    <Form
      form="communications"
      onChange={handleCommunications}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.formContainer}>
        {/*<div className={styles.formHeaderInput}>Reminders</div>
        <div className={styles.formSubHeader}>Sent Via Email</div>
        <FormSection name="remindersEmail" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via SMS</div>
        <FormSection name="remindersSMS" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via Phone</div>
        <FormSection name="remindersPhone" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formHeaderInput}>Recares</div>
        <div className={styles.formSubHeader}>Sent Via Email</div>
        <FormSection name="recaresEmail" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via SMS</div>
        <FormSection name="recaresSMS" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via Phone</div>
        <FormSection name="recaresPhone" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
          />
        </FormSection>*/}
        <div className={styles.formHeader}> Last Reminder Sent</div>
        <FormSection name="lastReminderSent" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
            theme={theme}
          />
        </FormSection>
        <div className={styles.formHeader}> Last Recall Sent</div>
        <FormSection name="lastRecareSent" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
            theme={theme}
          />
        </FormSection>
        <div className={styles.formHeader}> Reviews</div>
        <FormSection name="reviews" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
            theme={theme}
          />
        </FormSection>
        {/*<div className={styles.formHeader}> Surveys </div>
        <div className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="lastApp1"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="lastApp2"
          />
        </div>
        <div className={styles.formHeader}> Referrals </div>
        <div className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="lastApp1"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="lastApp2"
          />
        </div>*/}
      </div>
    </Form>
  );
}

Communications.propTypes = {
  handleCommunications: PropTypes.func.isRequired,
}
