
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Field, } from '../../library';
import styles from './styles.scss';


const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 30;
  const increments = 60 / increment;

  let i;
  for (i = 6; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const value = time.toISOString();
      const label = time.format('LT');
      timeOptions.push({ value, label });
    }
  }

  return timeOptions;
};

export const timeOptions = generateTimeOptions();

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

const statusOptions = [
  { label: 'Confirmed', value: true },
];

export default function AppointmentForm(props) {
  const {
    serviceOptions,
    practitionerOptions,
    chairOptions,
  } = props;

  return (
    <Grid className={styles.addNewAppt_mainContainer_left}>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            component="DayPicker"
            name="date"
            label="Date"
            borderColor="primaryColor"
            required
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={timeOptions}
            component="DropdownSelect"
            name="time"
            label="Time"
            borderColor="primaryColor"
            required
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={12} className={styles.addNewAppt_col}>
          <Field
            options={serviceOptions}
            component="DropdownSelect"
            name="serviceId"
            label="Service"
            borderColor="primaryColor"
            required
            onChange={(e, newValue)=> {console.log(newValue)}}
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Row className={styles.addNewAppt_col_nearFields}>
            <Col xs={9} >
              <Field
                options={practitionerOptions}
                component="DropdownSelect"
                name="practitionerId"
                label="Practitioner"
                borderColor="primaryColor"
                required
              />
            </Col>
            <Col xs={1} />
            <Col xs={2} >
              <Field
                options={[]}
                component="DropdownSelect"
                name="buffer"
                label=""
                borderColor="primaryColor"
                disabled
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
                borderColor="primaryColor"
                disabled
              />
            </Col>
            <Col xs={1} />
            <Col xs={2}>
              <Field
                options={[]}
                component="DropdownSelect"
                name="empty"
                label=""
                borderColor="primaryColor"
                disabled
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={chairOptions}
            component="DropdownSelect"
            name="chairId"
            label="Chair"
            borderColor="primaryColor"
            required
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={statusOptions}
            component="DropdownSelect"
            name="isPatientConfirmed"
            label="Status"
            borderColor="primaryColor"
            disabled
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} className={styles.addNewAppt_col_nearFields}>
          <Field
            component="RangeSlider"
            name="duration"
            label="Duration"
            unit="m"
            defaultValues={[60, 60]}
            min={15}
            max={180}
            marks={marks}
          />
        </Col>
      </Row>
    </Grid>
  );
}
