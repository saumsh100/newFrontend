import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Field, RangeSlider } from '../../library';
import { timeOptions } from '../../library/util/TimeOptions';
import styles from './styles.scss';

export default function PatientForm(props) {
  const {
    getSuggestions,
  } = props;

  return (
    <Grid className={styles.addNewAppt_mainContainer_right}>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            component="AutoComplete"
            name="patientId"
            label="Patient Name"
            getSuggestions={getSuggestions}
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            name="phone"
            label="Phone #"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} >
          <Field
            name="email"
            label="Email"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} className={styles.addNewAppt_col_textArea} >
          <Field
            component="TextArea"
            name="comment"
            label="Comment"
            rows={6}
            className={styles.addNewAppt_comment}
          />
        </Col>
      </Row>
    </Grid>
  );
}
