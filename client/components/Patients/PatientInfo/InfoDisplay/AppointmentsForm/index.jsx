
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Form, Field } from '../../../../library';
import { usStates } from '../../../../Settings/Clinic/Address/selectConstants';
import styles from '../styles.scss';
import FormSection from "../../../../library/Form/FormSection";

const normalizeBirthdate = (value) => {
  return value.trim();
};

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  if (!pattern.test(value)) {
    return format;
  } else {
    const date = moment(value, format);
    const isValid = date.isValid();
    if (!isValid) {
      return format;
    }
  }
};

const optionsGender = [
  { value: 'Male' },
  { value: 'Female' },
];

export default function AppointmentsForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="personForm"
      onSubmit={handleSubmit}
      className={styles.formContainer}
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
        <FormSection name="Other">
          <div className={styles.formHeader}> Other </div>
          <Row className={styles.row}>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="lastXrayDate"
                label="Last X-ray Date"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colRight}>
              <Field
                component="DropdownSelect"
                name="typeXray"
                label="Type of X-ray"
                options={[]}
                theme="primaryBlue"
              />
            </Col>
            <Col xs={12} className={styles.colRight}>
              <Field
                name="lastRestorativeVisit"
                label="Last Restorative Visit"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="lastRecallVisit"
                label="Last Recall Visit"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colRight}>
              <Field
                name="totalRecallVisits"
                label="Total Recall Visits"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colLeft}>
              <Field
                name="lastHygiene"
                label="Last Hygiene"
                component="DayPicker"
                theme="primaryBlue"
              />
            </Col>
            <Col xs={6} className={styles.colRight}>
              <Field
                name="totalRecallVisitsHygiene"
                label="Total Recall Visits"
                theme="primaryBlue"
              />
            </Col>
          </Row>
        </FormSection>
      </Grid>
    </Form>
  )
}
