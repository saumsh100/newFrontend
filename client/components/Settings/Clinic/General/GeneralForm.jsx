
import React, { PropTypes } from 'react';
import { Form, Field, Button, Grid, Row, Col } from '../../../library';
import styles from './styles.scss';

const normalizePhone = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, '')
  if (!previousValue || value.length > previousValue.length) {
    // typing forward
    if (onlyNums.length === 3) {
      return onlyNums + '-';
    }
    if (onlyNums.length === 6) {
      return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3) + '-';
    }
  }
  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 6) {
    return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3);
  }
  return onlyNums.slice(0, 3) + '-' + onlyNums.slice(3, 6) + '-' + onlyNums.slice(6, 10);
}

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(25);


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
              validate={[maxLength25]}
            />
          </Col>
        </Row>
        <Row className={styles.generalRow}>
          <Col xs={12}>
            <Field
              required
              name="smsPhoneNumber"
              label="SMS Phone Number"
              normalize={normalizePhone}
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