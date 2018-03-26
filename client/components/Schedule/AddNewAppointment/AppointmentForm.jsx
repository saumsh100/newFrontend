
import React from 'react';
import moment from 'moment-timezone';
import { Grid, Row, Col, Field } from '../../library';
import { parseNum, notNegative } from '../../library/Form/validate';
import styles from './styles.scss';
import SuggestionSelect from '../../library/DropdownSuggestion/SuggestionSelect';

Date.prototype.stdTimezoneOffset = function () {
  const jan = new Date(this.getFullYear(), 0, 1);
  const jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.dst = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
};


/**
 * The default format for the value key must be
 * ISOString ("YYYY-MM-DDTHH:mm:ss.sssZ")
 *
 * @param {string} val
 */
const formatTimeField = (val) => {
  let data;
  if (moment(val, 'LT', true).isValid()) {
    data = moment(`1970-01-31 ${val}`, 'YYYY-MM-DD LT').toISOString();
  } else if (moment(val, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()) {
    data = val;
  }
  return data;
};
/**
 * The default format for the label kry must be
 * LT ("HH:MM A|PM").
 *
 */
const renderTimeValue = (val) => {
  let data;
  if (moment(val, 'LT', true).isValid()) {
    data = val.toUpperCase();
  } else if (moment(val, 'YYYY-MM-DDTHH:mm:ss.sssZ', true).isValid()) {
    data = moment(val).format('LT');
  }
  return data;
};
/**
 * Validate if the given string is a valid time input
 *
 * @param {string} val
 */
const validateTimeField = val => moment(val, ['YYYY-MM-DDTHH:mm:ss.sssZ', 'LT'], true).isValid() && new RegExp('^((0?[0-9]|1[0-2]):[0-5][0-9] ([AP][M]))$', 'i').test(val);

export default function AppointmentForm(props) {
  const {
    practitionerOptions,
    chairOptions,
    time,
    unit,
    handleDurationChange,
    handleUnitChange,
    handleEndTimeChange,
    handleStartTimeChange,
    timeOptions,
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
        <Col xs={6}>
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
              options={timeOptions}
              component={SuggestionSelect}
              name="startTime"
              label="Start Time"
              required
              data-test-id="time"
              search="label"
              renderValue={renderTimeValue}
              formatValue={formatTimeField}
              validateValue={validateTimeField}
              onChange={(e, value) => handleStartTimeChange(formatTimeField(value))}
              theme={dropDownTheme}
            />
          </Col>
          <Col xs={1} />
          <Col xs={5} className={styles.colDropDown}>
            <Field
              options={timeOptions}
              component={SuggestionSelect}
              name="endTime"
              label="End Time"
              required
              data-test-id="time"
              search="label"
              renderValue={renderTimeValue}
              formatValue={formatTimeField}
              validateValue={validateTimeField}
              onChange={(e, value) => handleEndTimeChange(formatTimeField(value))}
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
            search="label"
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
              onChange={(e, value) => handleUnitChange(value)}
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
            search="label"
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
