import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';


const parseNum = value => value && parseInt(value);

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);

const notNegative = value => value && value <= 0 ? 'Must be greater than 0' : undefined;

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
          validate={[maxLength25]}
        />
      </div>
      <div className={styles.servicesFormRow__createRow}>
        <Field
          required
          name="duration"
          label="Duration"
          type="number"
          validate={[notNegative]}
          normalize={parseNum}
        />
      </div>
      <div className={styles.servicesFormRow__createRow}>
        <Field
          required
          name="bufferTime"
          label="Buffer Time"
          type="number"
          validate={[notNegative]}
          normalize={parseNum}
        />
      </div>
    </Form>
  </div>
  );
}

CreateServiceForm.propTypes = {
  onSubmit: PropTypes.func,
};

