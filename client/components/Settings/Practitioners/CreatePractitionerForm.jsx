import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

export default function CreatePractitionerForm(props) {
  const { onSubmit } = props;
  return (
  <div>
    <Form
      form="modalPractitionerForm"
      onSubmit={onSubmit}
    >
      <Grid >
        <Row className={styles.practFormRow__createRow}>
          <Col xs={12}>
            <CardHeader title="Add New Practitioner" />
          </Col>
        </Row>
        <Row className={styles.practFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="firstName"
              label="First Name"
            />
          </Col>
        </Row>
        <Row className={styles.practFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="lastName"
              label="Last Name"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  </div>
  );
}

