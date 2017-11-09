
import React, { PropTypes } from 'react';
import { FormSection, Field, Form } from '../../../../library';
import styles from '../styles.scss';

export default function Communications(props) {
  const {
    handleCommunications,
  } = props;

  return (
    <Form
      form="communications"
      onChange={handleCommunications}
      ignoreSaveButton
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeaderInput}>Reminders</div>
        <div className={styles.formSubHeader}>Sent Via Email</div>
        <FormSection name="remindersEmail" className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via SMS</div>
        <FormSection name="remindersSMS" className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formSubHeader}>Sent Via Phone</div>
        <FormSection name="remindersPhone" className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formHeaderInput}>Recares</div>
        <div className={styles.formSubHeader}>Sent Via Email</div>
        <div className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="firstApp1"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="firstApp2"
          />
        </div>
        <div className={styles.formSubHeader}>Sent Via SMS</div>
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
        <div className={styles.formSubHeader}>Sent Via Phone</div>
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
        <div className={styles.formHeader}> Last Reminder Sent</div>
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
        <div className={styles.formHeader}> Last Recare Sent</div>
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
        <div className={styles.formHeader}> Reviews</div>
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
