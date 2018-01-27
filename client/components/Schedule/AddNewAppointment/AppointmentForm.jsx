
import React, { Component, PropTypes } from 'react';
import moment from 'moment-timezone';
import { Grid, Row, Col, Field, Avatar, Icon } from '../../library';
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

const generateTimeOptions = (timeInput, unitIncrement) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = unitIncrement;
  const increments = 60 / increment;

  if (timeInput) {
    const minutes = moment(timeInput).minute();
    const remainder = minutes % increment;
    const today = new Date();
    const label = (today.dst() && !moment(new Date()).isDST() ? moment(timeInput).subtract(1, 'hours').format('LT') : moment(timeInput).format('LT'));
    if (remainder) {
      timeOptions.push({ value: timeInput, label });
    }
  }
  let i;
  for (i = 6; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const today = new Date();
      const value = time.toISOString();
      const label = (today.dst() && !moment(new Date()).isDST() ? time.subtract(1, 'hours').format('LT') : time.format('LT'));
      timeOptions.push({ value, label });
    }
  }

  for (i = 0; i < 6; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment(new Date(1970, 1, 0, i, j * increment));
      const today = new Date();
      const value = time.toISOString();
      const label = (today.dst() && !moment(new Date()).isDST() ? time.subtract(1, 'hours').format('LT') : time.format('LT'));
      timeOptions.push({ value, label });
    }
  }

  return timeOptions;
};

export default function AppointmentForm(props) {
  const {
    practitionerOptions,
    chairOptions,
    time,
    unit,
    handleDurationChange,
    handleUnitChange,
  } = props;

  const inputTheme = {
    input: styles.inputStyle,
  };

  const dropDownTheme = {
    input: styles.inputStyle,
  };

  return (
    <Grid className={styles.grid}>
      <Row className={styles.row}>
        <Col xs={6} >
          <Field
            component="DayPicker"
            name="date"
            label="Date"
            multiple={false}
            required
            data-test-id="date"
            tipSize={0.01}
            theme={inputTheme}
          />
        </Col>
        <Col xs={6} className={styles.col}>
          <Col xs={1} />
          <Col xs={5} className={styles.colDropDown}>
            <Field
              options={generateTimeOptions(time, unit)}
              component="DropdownSelect"
              name="startTime"
              label="Start Time"
              required
              data-test-id="time"
              search="label"
              onChange={(e, value) => props.handleStartTimeChange(value)}
              theme={dropDownTheme}
            />
          </Col>
          <Col xs={1} />
          <Col xs={5} className={styles.colDropDown}>
            <Field
              options={generateTimeOptions(time, unit)}
              component="DropdownSelect"
              name="endTime"
              label="End Time"
              required
              data-test-id="time"
              search="label"
              onChange={(e, value) => props.handleEndTimeChange(value)}
              theme={dropDownTheme}
            />
          </Col>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={6} className={styles.colDropDown}>
          <Field
            options={chairOptions}
            component="DropdownSelect"
            name="chairId"
            label="Chair"
            required
            data-test-id="chairId"
            theme={dropDownTheme}
          />
        </Col>
        <Col xs={6} className={styles.col}>
          <Col xs={1} />
          <Col xs={5}>
            <Field
              name="unit"
              label={`Unit (${unit})`}
              normalize={parseNum}
              validate={[notNegative]}
              type="number"
              onChange={(e, value)=> handleUnitChange(value)}
              data-test-id="unit"
              theme={inputTheme}
            />
          </Col>
          <Col xs={1} />
          <Col xs={5}>
            <Field
              name="duration"
              label="Duration"
              normalize={parseNum}
              validate={[notNegative]}
              type="number"
              onChange={(e, value) => handleDurationChange(value)}
              data-test-id="duration"
              theme={inputTheme}
            />
          </Col>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col xs={9} >
          <Field
            options={practitionerOptions}
            component="DropdownSelect"
            name="practitionerId"
            label="Practitioner"
            required
            data-test-id="practitionerId"
            className={styles.dropDownWrapper}
            theme={dropDownTheme}
          />
        </Col>
        <Col xs={3} className={styles.colConfirmCancel}>
          <div className={styles.confirmCancel}>
            <Field
              component="Checkbox"
              name="isPatientConfirmed"
              label="Confirmed"
              className={styles.confirmCancel_label}
              data-test-id="isPatientConfirmed"
              labelClassNames={styles.checkBox}
            />
            <Field
              component="Checkbox"
              name="isCancelled"
              label="Cancelled"
              className={styles.confirmCancel_label}
              data-test-id="isCancelled"
              labelClassNames={styles.checkBox}
            />
          </div>
        </Col>
      </Row>
      <Row className={styles.rowTextArea}>
        <Col xs={12} className={styles.textAreaContainer}>
          <Field
            component="TextArea"
            name="note"
            label="Notes:"
            rows={9}
            data-test-id="note"
            classStyles={styles.textArea}
          />
        </Col>
      </Row>
    </Grid>
  );
}
