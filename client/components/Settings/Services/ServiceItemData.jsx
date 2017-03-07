import React, {Component, PropTypes } from 'react';
import { Row, Col, Form, Grid, Field } from '../../library';
import styles from './styles.scss';

export default function ServiceItemData(props) {

  const { name, duration, onSubmit, unitCost } = props;

  const initialValues = {
    name: name,
    duration: duration,
  };
  return (

    <Form form={`${name}Form`}
          onSubmit={onSubmit}
          initialValues={initialValues}
          className={styles.servicesForm}
    >
      <Grid className={styles.servicesFormGrid}>
        <Row className={styles.servicesFormRow}>
          <Col>
            <Field
              required
              name="name"
              label="Name"
            />
          </Col>
        </Row>
        <Row className={styles.servicesFormRow}>
          <Col>
            <Field
              required
              name="duration"
              label="Duration"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}
