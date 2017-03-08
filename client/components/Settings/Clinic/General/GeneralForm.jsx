
import React, { PropTypes } from 'react';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';

export default function GeneralForm({ onSubmit, activeAccount }) {
  const initialValues = {
    name: activeAccount.get('name'),
    smsPhoneNumber: activeAccount.get('smsPhoneNumber'),
  };

  return (
    <Form form="generalSettingsForm"
          onSubmit={onSubmit}
          initialValues={initialValues}
          className={styles.generalForm}
    >
      <Grid>
        <Row className={styles.generalRow}>
          <Col xs={12}>
            <Field
              required
              name="name"
              label="Name"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              required
              name="smsPhoneNumber"
              label="SMS Phone Number"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

GeneralForm.propTypes = {
  onSubmit: PropTypes.func,
}