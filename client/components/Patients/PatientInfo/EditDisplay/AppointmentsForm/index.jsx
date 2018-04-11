
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';

export default function AppointmentsForm(props) {
  const { handleSubmit, inputStyle, patient } = props;

  const {
    dueForHygieneDate,
    dueForRecallExamDate,
    lastRecallDate,
    lastHygieneDate,
  } = patient.toJS();
  const initialValues = {
    dueForHygieneDate,
    dueForRecallExamDate,
    lastRecallDate,
    lastHygieneDate,
  };

  return (
    <Form
      form="Form1"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <div className={styles.formHeader}>Last Appointment</div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field name="lastRecallDate" label="Recall" component="DayPicker" theme={inputStyle} />
          </Col>
          <Col xs={6}>
            <Field
              component="DayPicker"
              name="lastHygieneDate"
              label="Hygiene"
              theme={inputStyle}
            />
          </Col>
        </Row>
        <div className={styles.formHeader}>Continuing Care</div>
        <Row className={styles.row}>
          <Col xs={6} className={styles.colLeft}>
            <Field
              name="dueForHygieneDate"
              label="Due for Hygiene"
              component="DayPicker"
              theme={inputStyle}
            />
          </Col>
          <Col xs={6}>
            <Field
              component="DayPicker"
              name="dueForRecallExamDate"
              label="Due for Recall Exam"
              theme={inputStyle}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AppointmentsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  dropDownStyle: PropTypes.string,
  inputStyle: PropTypes.string,
  patient: PropTypes.instanceOf(Object),
};
