import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

export default function CreateServiceForm(props) {
  const { onSubmit } = props;
  return (
  <div className={styles.formContainer__createForm}>
    <Form
      form="modalServiceForm"
      onSubmit={onSubmit}
    >
      <div className={styles.servicesFormRow__createRow}>
        <CardHeader title="Create New Service" />
      </div>
      <div className={styles.servicesFormRow__createRow}>
        <Field
          required
          name="name"
          label="Name"
        />
      </div>
      <div className={styles.servicesFormRow__createRow}>
        <Field
          required
          name="duration"
          label="Duration"
          validate={[isNumber]}
        />
      </div>
      <div className={styles.servicesFormRow__createRow}>
        <Field
          required
          name="bufferTime"
          label="Buffer Time"
          validate={[isNumber]}
        />
      </div>
    </Form>
  </div>
  );
}

