
import PropTypes from 'prop-types';
import React from 'react';
import { withState } from 'recompose';
import moment from 'moment';
import { connect } from 'react-redux';
import { Form, Field, Icon, Grid, Row, Col } from '../../../../library';
// import TimeOffDisplay from './TimeOffDisplay';
import styles from './styles.scss';

const generateTimeOptions = (timezone) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 60;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i++) {
    let j;
    for (j = 0; j < increments; j++) {
      const time = moment.tz(`1970-1-31 ${i}:${j * increment}`, 'YYYY-M-D H:mm', timezone);
      const value = time.format();
      const label = time.format('LT');
      timeOptions.push({
        value,
        label,
      });
    }
  }

  return timeOptions;
};

const defaultTimeOptions = {
  year: 1970,
  month: 0,
  date: 31,
  minutes: 0,
};

const setTime = (time, timezone) => {
  const completeTime = moment.tz(time, 'YYYY-MM-DDThh:mm:ssZ', timezone).set(defaultTimeOptions);

  if (!completeTime.isValid()) {
    return moment
      .tz(time, timezone)
      .set({
        ...defaultTimeOptions,
        hour: 0,
      })
      .format();
  }

  return completeTime.format();
};

const setDate = (date, timezone) => {
  const mergeTime = moment(date, 'YYYY-MM-DDThh:mm:ssZ').tz(timezone);

  if (!mergeTime.isValid()) {
    return moment()
      .tz(timezone)
      .set({
        hour: 0,
        minute: 0,
      })
      .format('L');
  }

  return mergeTime.format('L');
};

const checkDates = ({ startDate, endDate }) => {
  const errors = {};
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);

  if (sDate > eDate) {
    errors.startDate = 'Start date has to be less than end date.';
  } else if (eDate < sDate) {
    errors.endDate = 'End date has to be greater than start date.';
  }

  return errors;
};

const maxLength = max => value =>
  (value && (value.length > max || value.length < max)
    ? 'Please enter a date: DD/MM/YYYY.'
    : undefined);
const maxLength10 = maxLength(10);

function RecurringTimeOffForm(props) {
  const { timeOff, formName, handleSubmit, values, showOption, setOption, timezone } = props;

  const {
    startDate,
    endDate,
    startTime,
    endTime,
    interval,
    allDay,
    dayOfWeek,
    note,
  } = timeOff.toJS();

  const timeOptions = generateTimeOptions(timezone);

  const initialValues = {
    startDate: setDate(startDate, timezone),
    endDate: setDate(endDate, timezone),
    startTime: setTime(startTime, timezone),
    endTime: setTime(endTime, timezone),
    allDay,
    dayOfWeek,
    interval: interval ? interval.toString() : null,
    note,
  };

  const startTimeComponent = !values.allDay && (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="startTime"
      label="Start Time"
      className={styles.inlineBlock}
      data-test-id="startTime"
    />
  );
  const endTimeComponent = !values.allDay && (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="endTime"
      label="End Time"
      className={styles.inlineBlock}
      data-test-id="endTime"
    />
  );

  const showNoteComponent = showOption && <Field name="note" label="Note" />;
  const optionsIcon = showOption ? 'minus' : 'plus';

  const columnSizeDate = values.allDay ? 12 : 8;
  const columnSizeTime = values.allDay ? 0 : 4;

  return (
    <Form
      ignoreSaveButton
      form={formName}
      onSubmit={handleSubmit}
      validate={checkDates}
      initialValues={initialValues}
      data-test-id="addRecurringTimeOffForm"
    >
      <Grid>
        <Row className={styles.minHeight}>
          <Field
            name="interval"
            label="Interval"
            component="DropdownSelect"
            data-test-id="dropdown_interval"
            options={[{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }]}
          />
        </Row>
        <Row className={styles.minHeight}>
          <Field
            name="dayOfWeek"
            label="Day of Week"
            component="DropdownSelect"
            data-test-id="dropdown_dayOfWeek"
            options={[
              { value: 'Sunday' },
              { value: 'Monday' },
              { value: 'Tuesday' },
              { value: 'Wednesday' },
              { value: 'Thursday' },
              { value: 'Friday' },
              { value: 'Saturday' },
            ]}
          />
        </Row>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              component="DayPicker"
              name="startDate"
              label="Start Date"
              timezone={timezone}
              data-test-id="startDate"
            />
          </Col>
          <Col xs={12} md={columnSizeTime} className={styles.flexCenter}>
            {startTimeComponent}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              component="DayPicker"
              name="endDate"
              label="End Date"
              timezone={timezone}
              data-test-id="endDate"
            />
          </Col>
          <Col xs={12} md={columnSizeTime} className={styles.flexCenter}>
            {endTimeComponent}
          </Col>
        </Row>
        <Row className={styles.flexCenter}>
          <Col xs={6} className={styles.allDay} data-test-id="toggle_allDay">
            <div className={styles.allDay_text}> All Day </div>
            <Field component="Toggle" name="allDay" />
          </Col>
          <Col xs={6}>
            <div onClick={() => setOption(!showOption)} className={styles.moreOptions}>
              More Options
              <Icon icon={optionsIcon} className={styles.moreOptions_icon} />
            </div>
          </Col>
        </Row>
      </Grid>
      {showNoteComponent}
      {
        // <TimeOffDisplay values={values} />
      }
    </Form>
  );
}

RecurringTimeOffForm.propTypes = {
  timezone: PropTypes.string.isRequired,
  timeOff: PropTypes.object,
  formName: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
};

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return { values: {} };
  }

  return { values: form[formName].values };
}

const enhance = withState('showOption', 'setOption', false);

export default enhance(connect(
  mapStateToProps,
  null,
)(RecurringTimeOffForm));
