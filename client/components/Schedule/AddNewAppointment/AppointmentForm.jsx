import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Field, RangeSlider } from '../../library';
import { timeOptions } from '../../library/util/TimeOptions';
import styles from './styles.scss';

export default function   AppointmentForm(props) {
  return (
    <Grid >
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            component="DayPicker"
            name="date"
            label="Date"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={timeOptions}
            component="DropdownSelect"
            name="time"
            label="Time"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={12} className={styles.addNewAppt_col}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="service"
            label="Service"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Row className={styles.addNewAppt_col_nearFields}>
            <Col xs={9} >
              <Field
                options={[]}
                component="DropdownSelect"
                name="practitioner"
                label="Practitioner"
              />
            </Col>
            <Col xs={1} />
            <Col xs={2} >
              <Field
                options={[]}
                component="DropdownSelect"
                name="duration"
                label=""
              />
            </Col>
          </Row>
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Row className={styles.addNewAppt_col_nearFields}>
            <Col xs={9} >
              <Field
                options={[]}
                component="DropdownSelect"
                name="split"
                label="Split"
              />
            </Col>
            <Col xs={1} />
            <Col xs={2}>
              <Field
                options={[]}
                component="DropdownSelect"
                name="empty"
                label=""
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="chair"
            label="Chair"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="status"
            label="Status"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} className={styles.addNewAppt_col_nearFields}>
          <Field
            component="RangeSlider"
            name="duration2"
            label="Duration"
          />
        </Col>
      </Row>
    </Grid>
  );
}
