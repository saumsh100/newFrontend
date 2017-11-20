
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function InsuranceForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="Form3"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              required
              name="insuranceCarrier"
              label="Insurance Carrier"
              theme="primaryBlue"
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="memberId"
              label="Member ID"
              theme="primaryBlue"
            />
          </Col>
          <Col xs={6} className={styles.colRight}>
            <Field
              name="contractId"
              label="Contract ID"
              theme="primaryBlue"
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="sin"
              label="SIN"
              theme="primaryBlue"
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  )
}

InsuranceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
