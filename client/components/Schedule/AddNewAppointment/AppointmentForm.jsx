
import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { Grid, Row, Col, Field, } from '../../library';
import { parseNum, notNegative} from '../../library/Form/validate'
import styles from './styles.scss';

Date.prototype.stdTimezoneOffset = function () {
  const jan = new Date(this.getFullYear(), 0, 1);
  const jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

const maxDuration = value => value && value > 180 ? 'Must be less than or equal to 180' : undefined;

const generateTimeOptions = (timeInput, unitIncrement) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = unitIncrement;
  const increments = 60 / increment;

  if (timeInput) {
    const minutes = moment(timeInput).minute();
    const remainder = minutes % increment;
    const today = new Date();
    const label = (today.dst() ? moment(timeInput).subtract(1, 'hours').format('LT') : moment(timeInput).format('LT'));
    if (remainder) {
      timeOptions.push({ value: timeInput, label });
    }
  }

  let i;
  for (i = 6; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(Date.UTC(1970, 1, 0, i, j * increment)));
      const today = new Date();
      const value = time.toISOString();
      const label = (today.dst() ? time.subtract(1, 'hours').format('LT') : time.format('LT'));
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

export default function AppointmentForm(props) {
  const {
    serviceOptions,
    practitionerOptions,
    chairOptions,
    handlePractitionerChange,
    selectedAppointment,
    time,
    unit,
    handleSliderChange,
    handleDurationChange,
    handleUnitChange,
    handleBufferChange,
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
            multiple={false}
            required
            data-test-id="date"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={generateTimeOptions(time, unit)}
            component="DropdownSelect"
            name="time"
            label="Time"
            borderColor="primaryColor"
            required
            data-test-id="time"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row}>
        <Col xs={12} md={12} className={styles.addNewAppt_col}>
          <Row className={styles.addNewAppt_col_nearFields}>
            <Col xs={12} >
              <Field
                options={practitionerOptions}
                component="DropdownSelect"
                name="practitionerId"
                label="Practitioner"
                borderColor="primaryColor"
                onChange={(e, newValue) => handlePractitionerChange(newValue)}
                required
                data-test-id="practitionerId"
              />
            </Col>
          </Row>
        </Col>
        {/*<Col md={2} />
         <Col xs={12} md={5} className={styles.addNewAppt_col}>
         <Row className={styles.addNewAppt_col_nearFields}>
         <Col xs={12} >
         <Field
         options={[]}
         component="DropdownSelect"
         name="split"
         label="Split"
         borderColor="primaryColor"
         disabled
         />
         </Col>
         </Row>
         </Col>*/}
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
            data-test-id="serviceId"
          />
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
            data-test-id="chairId"
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <div className={styles.addNewAppt_col_confirmCancel}>
            <Field
              component="Checkbox"
              name="isPatientConfirmed"
              label="Patient Confirmed"
              className={styles.addNewAppt_col_confirmCancel_label}
              data-test-id="isPatientConfirmed"
            />
            <Field
              component="Checkbox"
              name="isCancelled"
              label="Patient Cancelled"
              className={styles.addNewAppt_col_confirmCancel_label}
              hidden={selectedAppointment && !selectedAppointment.request ? false : true}
              data-test-id="isCancelled"
            />
          </div>
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row_durBuff}>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            name="duration"
            label="Duration"
            borderColor="primaryColor"
            normalize={parseNum}
            validate={[notNegative, maxDuration]}
            type="number"
            onChange={(e, value) => handleDurationChange(value)}
            required
            data-test-id="duration"
          />
        </Col>
        <Col xs={12} md={2} className={styles.addNewAppt_col_unit}>
          <Field
            name="unit"
            label="Unit"
            borderColor="primaryColor"
            normalize={parseNum}
            validate={[notNegative, maxDuration]}
            type="number"
            onChange={(e, value)=>{handleUnitChange(value)}}
            data-test-id="unit"
          />
        </Col>
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            name="buffer"
            label="Buffer"
            borderColor="primaryColor"
            normalize={parseNum}
            validate={[notNegative, maxDuration]}
            type="number"
            onChange={(e, value) => handleBufferChange(value)}
            data-test-id="buffer"
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_row_slider}>
        <Col xs={12} className={styles.addNewAppt_col_nearFields}>
          <Field
            component="RangeSlider"
            name="slider"
            unit="m"
            defaultValues={[60,61]}
            min={unit}
            max={180}
            marks={marks}
            onChange={(e, value)=> handleSliderChange(value)}
            data-test-id="slider"
          />
        </Col>
      </Row>
    </Grid>
  );
}
