
import React, { useMemo } from 'react';
import { Form, Field, Icon, Grid, Row, Col, generateTimeBreaks } from '../../../../library';
import TimeOffDisplay from './TimeOffDisplay';
import styles from './styles.scss';
import {
  enhanceFormHOC,
  TimeOffDefaultProps,
  TimeOffFormPropTypes,
  setDate,
  setTime,
  checkDates,
} from '../timeOffHelper';

const TimeOffForm = ({
  timeOff,
  formName,
  handleSubmit,
  values,
  showOption,
  setOption,
  timezone,
}) => {
  const { startDate, endDate, allDay, note } = timeOff.toJS();

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
    startDate: setDate(startDate, timezone),
    endDate: setDate(endDate, timezone),
    allDay,
    startTime: setTime(startDate, timezone),
    endTime: setTime(endDate, timezone),
    note,
  };

  const startTimeComponent = !values.allDay ? (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="startTime"
      label="Start Time"
      className={styles.inlineBlock}
      data-test-id="startTime"
    />
  ) : null;
  const endTimeComponent = !values.allDay ? (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="endTime"
      label="End Time"
      className={styles.inlineBlock}
      data-test-id="endTime"
    />
  ) : null;

  const showNoteComponent = showOption && (
    <Field name="note" label="Note" data-test-id="noteInput" />
  );
  const optionsIcon = showOption ? 'minus' : 'plus';

  const columnSizeDate = values.allDay ? 12 : 8;
  const columnSizeTime = values.allDay ? 0 : 4;

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      validate={checkDates}
      initialValues={initialValues}
      ignoreSaveButton
      data-test-id="addTimeOffForm"
    >
      <Grid>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              component="DayPicker"
              timezone={timezone}
              name="startDate"
              label="Start Date"
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
              timezone={timezone}
              name="endDate"
              label="End Date"
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
              data-test-id="moreOptionsButton"
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
      <TimeOffDisplay values={values} timezone={timezone} />
    </Form>
  );
};

TimeOffForm.propTypes = TimeOffFormPropTypes;
TimeOffForm.defaultProps = TimeOffDefaultProps;
export default enhanceFormHOC(TimeOffForm);
