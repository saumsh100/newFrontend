
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import styles from '../styles.scss';
import FormSection from '../../../../library/Form/FormSection';

export default function AppointmentsForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="Form1"
      onSubmit={handleSubmit}
      className={styles.formContainer}
      ignoreSaveButton
    >
      <Grid className={styles.grid}>
        <FormSection name="Last Appointment">
          <div className={styles.formHeader}> Last Appointment </div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="recall"
                label="Recall"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colRight}>
              <Field
                component="DayPicker"
                name="hygiene"
                label="Hygiene"
                theme="primaryBlue"
              />
            </Col>
          </Row>
        </FormSection>
        <FormSection name="Continuing Care">
          <div className={styles.formHeader}> Continuing Care </div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="recall"
                label="Recall"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colRight}>
              <Field
                component="DropdownSelect"
                name="hygiene"
                label="Hygiene"
                options={[]}
                theme="primaryBlue"
              />
            </Col>
          </Row>
        </FormSection>
      </Grid>
    </Form>
  )
}
