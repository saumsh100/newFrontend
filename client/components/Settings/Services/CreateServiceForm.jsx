import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';

function isNumber(value){
  return value && !/\D/.test(value) ? undefined : 'Please enter a number.';
}

export default function CreateServiceForm(props){
  const { onSubmit } = props;
  return (
  <div>
    <Form
      form="modalForm"
      onSubmit={onSubmit}
    >
      <Grid >
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <CardHeader title="Create New Service" />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="name"
              label="Name"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="duration"
              label="Duration"
              validate={[isNumber]}
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow__createRow}>
          <Col xs={12}>
            <Field
              required
              name="bufferTime"
              label="Buffer Time"
              validate={[isNumber]}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  </div>
  );
}

