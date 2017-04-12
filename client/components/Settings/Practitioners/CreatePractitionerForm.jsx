import React, {Component, PropTypes} from 'react';
import { CardHeader, Form, Field } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

export default function CreatePractitionerForm(props) {
  const { onSubmit } = props;
  return (
  <div className={styles.practFormContainer__createForm}>
    <Form
      form="modalPractitionerForm"
      onSubmit={onSubmit}
    >
      <div className={styles.practFormRow__createRow}>
        <Field
          required
          name="firstName"
          label="First Name"
        />
      </div>
      <div className={styles.practFormRow__createRow}>
        <Field
          required
          name="lastName"
          label="Last Name"
        />
      </div>
    </Form>
  </div>
  );
}

