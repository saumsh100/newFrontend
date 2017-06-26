
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Grid, Row, Col, Field, } from '../../library';
import { parseNum, notNegative} from '../../library/Form/validate'
import styles from './styles.scss';

const maxDuration = value => value && value > 180 ? 'Must be less than or equal to 180' : undefined;

const generateTimeOptions = (timeInput) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 15;
  const increments = 60 / increment;

  if (timeInput) {
    const minutes = moment(timeInput).minute();
    const remainder = minutes % increment;
    if (remainder) {
      timeOptions.push({ value: timeInput, label: moment(timeInput).format('LT') });
    }
  }

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

export default function AppointmentForm(props) {
  const {
    serviceOptions,
    practitionerOptions,
    chairOptions,
    handlePractitionerChange,
    selectedAppointment,
    time,
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
          />
        </Col>
        <Col md={2} />
        <Col xs={12} md={5} className={styles.addNewAppt_col}>
          <Field
            options={generateTimeOptions(time)}
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
            />
            <Field
              component="Checkbox"
              name="isCancelled"
              label="Patient Cancelled"
              className={styles.addNewAppt_col_confirmCancel_label}
              hidden={selectedAppointment && !selectedAppointment.request ? false : true}
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
            min={15}
            max={180}
            marks={marks}
            onChange={(e, value)=> handleSliderChange(value)}
          />
        </Col>
      </Row>
    </Grid>
  );
}
