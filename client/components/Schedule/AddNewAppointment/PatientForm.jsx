import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Field, RangeSlider } from '../../library';
import { timeOptions } from '../../library/util/TimeOptions';
import styles from './styles.scss';

export default function PatientForm(props) {
  return (
    <Grid className={styles.addNewAppt_grid_right}>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} >
          <Field
            name="name"
            label="Patient Names"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12}>
          <Field
            name="phone"
            label="Phone #"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} className={styles.addNewAppt_col_select}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="email"
            label="Email"
          />
        </Col>
      </Row>
    </Grid>
  );
}
