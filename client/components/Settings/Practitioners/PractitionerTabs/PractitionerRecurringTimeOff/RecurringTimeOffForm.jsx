
import React, { useMemo } from 'react';
import { Form, Field, Icon, Grid, Row, Col, generateTimeBreaks } from '../../../../library';
import styles from './styles.scss';
import {
  enhanceFormHOC,
  TimeOffDefaultProps,
  TimeOffFormPropTypes,
  setDate,
  setTime,
  checkDates,
} from '../timeOffHelper';

const RecurringTimeOffForm = ({
  timeOff,
  formName,
  handleSubmit,
  values,
  showOption,
  setOption,
  timezone,
}) => {
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

  const timeOptions = useMemo(
    () =>
      generateTimeBreaks({
        timezone,
        timeOnly: false,
        hourInterval: 1,
        useISOValue: false,
      }),
    [timezone],
  );

  const initialValues = {
    startDate: setDate(startDate, timezone, true),
    endDate: setDate(endDate, timezone, true),
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
            <div
              onClick={() => setOption(!showOption)}
              className={styles.moreOptions}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.stopPropagation();
                  setOption(!showOption);
                }
              }}
            >
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
};

RecurringTimeOffForm.propTypes = TimeOffFormPropTypes;
RecurringTimeOffForm.defaultProps = TimeOffDefaultProps;
export default enhanceFormHOC(RecurringTimeOffForm);
