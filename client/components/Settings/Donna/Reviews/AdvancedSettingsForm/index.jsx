
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import styles from './styles.scss';

const lastReviewIntervalOptions = [
  { label: 'Always ask',
    value: '0 milliseconds' },
  { label: "Don't ask again",
    value: 'null' },
  { label: '1 Month',
    value: '1 months' },
  { label: '3 Months',
    value: '3 months' },
  { label: '6 Months',
    value: '6 months' },
  { label: '1 Year',
    value: '1 years' },
  { label: '2 Years',
    value: '2 years' },
];

const lastSentReviewIntervalOptions = [
  { label: 'Always ask',
    value: '0 milliseconds' },
  { label: "Don't ask again",
    value: 'null' },
  { label: '1 Day',
    value: '1 days' },
  { label: '1 Week',
    value: '1 weeks' },
  { label: '2 Weeks',
    value: '2 weeks' },
  { label: '1 Month',
    value: '1 months' },
  { label: '3 Months',
    value: '3 months' },
  { label: '6 Months',
    value: '6 months' },
  { label: '1 Year',
    value: '1 years' },
];

const Question = props => <div className={styles.question} {...props} />;

export default function AdvancedSettingsForm({ form, initialValues, onSubmit }) {
  const { lastReviewInterval, lastSentReviewInterval } = initialValues;
  initialValues.lastReviewInterval = lastReviewInterval === null ? 'null' : lastReviewInterval;
  initialValues.lastSentReviewInterval =
    lastSentReviewInterval === null ? 'null' : lastSentReviewInterval;
  return (
    <Form
      ignoreSaveButton
      enableReinitialize
      form={form}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id={form}
    >
      <Question>
        Do you want Donna to send Review Requests to patients with unconfirmed appointments?
      </Question>
      <Field component="Toggle" name="sendUnconfirmedReviews" className={styles.toggleWrapper} />
      <Question>
        If a CareCru Review is submitted by the patient, how long until Donna asks again?
      </Question>
      <Field
        component="DropdownSelect"
        className={styles.dropdown}
        name="lastReviewInterval"
        options={lastReviewIntervalOptions}
      />
      <Question>
        If a CareCru Review is <u>not</u> submitted by the patient, how long until Donna asks again?
      </Question>
      <Field
        component="DropdownSelect"
        className={styles.dropdown}
        name="lastSentReviewInterval"
        options={lastSentReviewIntervalOptions}
      />
    </Form>
  );
}

AdvancedSettingsForm.propTypes = {
  form: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
