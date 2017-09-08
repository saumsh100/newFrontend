
import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../../library';
import { emailValidate } from '../../../../library/Form/validate';
import styles from '../styles.scss';

export default function SelectAccountOptions(props) {
  const {
    onSubmit,
    index,
    initialValues,
    formName,
  } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <div className={styles.accountOptions}>
        <div className={styles.displayFlex}>
          <span className={styles.accountOptions_text}>
            Set Up Reputation Management
          </span>
          <div>
            <Field
              component="Toggle"
              name="reputationManagement"
            />
          </div>
        </div>

        <div className={styles.displayFlex}>
          <span className={styles.accountOptions_text}>
            Setup Reminders
          </span>
          <div>
            <Field
              component="Toggle"
              name="canSendReminders"
            />
          </div>
        </div>

        <div className={styles.displayFlex}>
          <span className={styles.accountOptions_text}>
            Setup Recalls
          </span>
          <div>
            <Field
              component="Toggle"
              name="canSendRecalls"
            />
          </div>
        </div>
        <div className={styles.displayFlex}>
          <span className={styles.accountOptions_text}>
            Set Up Call Tracking
          </span>
          <div>
            <Field
              component="Toggle"
              name="callTracking"
            />
          </div>
        </div>
      </div>
    </Form>
  );
}
