import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Field, RangeSlider } from '../../library';
import { timeOptions } from '../../library/util/TimeOptions';
import styles from './styles.scss';

const marks = {
  15: '15',
  30: '30',
  45: '45',
  60: '60',
  75: '75',
  90: '90',
  105: '105',
  120: '120',
  135: '135',
  150: '150',
  165: '165',
  180: '180',
};

export default function   AppointmentForm(props) {
  return (
    <Grid className={styles.addNewAppt_grid_left}>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            component="DayPicker"
            name="date"
            label="DATE"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={timeOptions}
            component="DropdownSelect"
            name="time"
            label="TIME"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={12} className={styles.addNewAppt_col}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="service"
            label="SERVICE"
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
                label="PRACTITIONER"
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
                label="SPLIT"
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
            label="CHAIR"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={[]}
            component="DropdownSelect"
            name="status"
            label="STATUS"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} className={styles.addNewAppt_col_nearFields}>
          <Field
            component="RangeSlider"
            name="duration"
            label="DURATION"
            min={15}
            max={180}
            marks={marks}
          />
        </Col>
      </Row>
    </Grid>
  );
}
