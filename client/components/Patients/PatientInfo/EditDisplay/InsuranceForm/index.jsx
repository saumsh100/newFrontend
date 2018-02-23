
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function InsuranceForm(props) {
  const {
    handleSubmit,
    inputStyle,
    dropDownStyle,
  } = props;

  return (
    <div className={styles.formContainer}>
      <div className={styles.disabledPage}>
        <div className={styles.disabledPage_text}>
          No Insurance Information
        </div>
      </div>
    </div>
  );

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
              theme={inputStyle}
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="memberId"
              label="Member ID"
              theme={inputStyle}
            />
          </Col>
          <Col xs={6} >
            <Field
              name="contractId"
              label="Contract ID"
              theme={inputStyle}
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="sin"
              label="SIN"
              theme={inputStyle}
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
