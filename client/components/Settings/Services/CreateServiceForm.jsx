import React, {Component, PropTypes} from 'react';
import { CardHeader,Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';


export default function CreateServiceForm(props){
  const { onSubmit } = props;
  return (
  <div>
    <Form
      form="modalForm"
      onSubmit={onSubmit}
    >
      <Grid >
        <Row className={styles.servicesFormRow}>
          <Col xs={12}>
            <CardHeader title="Create New Service" />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow}>
          <Col xs={12}>
            <Field
              required
              name="name"
              label="Name"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow}>
          <Col xs={12}>
            <Field
              required
              name="duration"
              label="Duration"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow}>
          <Col xs={12}>
            <Field
              required
              name="unitCost"
              label="Unit Costs"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow}>
          <Col xs={12}>
            <Field
              required
              name="bufferTime"
              label="Buffer Time"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  </div>
  );
}

