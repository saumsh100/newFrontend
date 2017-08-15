import React, {Component, PropTypes} from 'react';
import { CardHeader, Form, Field } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

export default function CreatePractitionerForm(props) {
  const { onSubmit, formName } = props;
  return (
  <div className={styles.practFormContainer__createForm}>
    <Form
      form={formName}
      onSubmit={onSubmit}
      data-test-id="createPractitionerForm"
      ignoreSaveButton
    >
      <div className={styles.practFormRow__createRow}>
        <Field
          required
          name="firstName"
          label="First Name"
          data-test-id="firstName"
        />
      </div>
      <div className={styles.practFormRow__createRow}>
        <Field
          required
          name="lastName"
          label="Last Name"
          data-test-id="lastName"
        />
      </div>
    </Form>
  </div>
  );
}

