
import React, { Component, PropTypes } from 'react';
import { Form, Field, } from '../../../../library';
import { emailValidate } from '../../../../library/Form/validate';
import styles from '../styles.scss';
import Icon from "../../../../library/Icon/index";

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
          <span>
            <Icon icon="star" />
          </span>
          <span className={styles.accountOptions_text}>
            Reputation Management
          </span>
          <div>
            <Field
              component="Toggle"
              name="reputationManagement"
            />
          </div>
        </div>

        <div className={styles.displayFlex}>
          <span>
            <Icon icon="clock-o" />
          </span>
          <span className={styles.accountOptions_text}>
            Reminders
          </span>
          <div>
            <Field
              component="Toggle"
              name="canSendReminders"
            />
          </div>
        </div>

        <div className={styles.displayFlex}>
          <span>
            <Icon icon="bullhorn" />
          </span>
          <span className={styles.accountOptions_text}>
            Recalls
          </span>
          <div>
            <Field
              component="Toggle"
              name="canSendRecalls"
            />
          </div>
        </div>
        <div className={styles.displayFlex}>
          <span>
            <Icon icon="phone" />
          </span>
          <span className={styles.accountOptions_text}>
            Call Tracking
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
