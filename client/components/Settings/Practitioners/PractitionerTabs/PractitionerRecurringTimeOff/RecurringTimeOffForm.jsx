
import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  Form,
  Field,
  Icon,
  Grid,
  Row,
  Col,
} from '../../../../library';
// import TimeOffDisplay from './TimeOffDisplay';
import styles from './styles.scss';

const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;

  let i;
  for (i = 0; i < totalHours; i++) {
    const labelValue = i % 12;
    const value = ((i + 1) * 60).toString();
    const label = i / 12 >= 1 ?  `${labelValue + 1}:00 PM` : `${labelValue + 1}:00 AM`;

    timeOptions.push({ value, label });
  }

  return timeOptions;
};

const timeOptions = generateTimeOptions();

const setTime = (time) => {
  const tempTime = new Date(time);
  const mergeTime = new Date(1970, 1, 0);
  mergeTime.setHours(tempTime.getHours());
  return mergeTime.toISOString();
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
  value && (value.length > max || value.length < max) ? 'Please enter a date: DD/MM/YYYY.' : undefined
const maxLength10 = maxLength(10);

function RecurringTimeOffForm(props) {
  const {
    timeOff,
    formName,
    handleSubmit,
    values,
    showOption,
    setOption
  } = props;

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

  const initialValues = {
    startDate: moment(startDate).format('L'),
    endDate: moment(endDate).format('L'),
    startTime: startTime ? startTime.toString() : null,
    endTime: endTime ? endTime.toString() : null,
    allDay,
    dayOfWeek,
    interval: interval ? interval.toString() : null,
    note,
  };

  const startTimeComponent = !values.allDay ? (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="startTime"
      label="Start Time"
      className={styles.inlineBlock}
    />) : null;
  const endTimeComponent = !values.allDay ? (
    <Field
      component="DropdownSelect"
      options={timeOptions}
      name="endTime"
      label="End Time"
      className={styles.inlineBlock}
    />) : null;

  const showNoteComponent = showOption ? <Field name="note" label="Note" /> : null;
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
    >
      <Grid>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              name="interval"
              label="Interval"
              component="DropdownSelect"
              options={[
                { value: '1' },
                { value: '2' },
                { value: '3' },
                { value: '4' },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              name="dayOfWeek"
              label="Day of Week"
              component="DropdownSelect"
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
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={columnSizeDate}>
            <Field
              component="DayPicker"
              name="startDate"
              label="Start Date"
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
            />
          </Col>
          <Col xs={12} md={columnSizeTime} className={styles.flexCenter}>
            {endTimeComponent}
          </Col>
        </Row>
        <Row className={styles.flexCenter}>
          <Col xs={6} className={styles.allDay}>
            <div className={styles.allDay_text}> All Day </div>
            <Field
              component="Toggle"
              name="allDay"
            />
          </Col>
          <Col xs={6}>
            <div onClick={() => setOption(!showOption)} className={styles.moreOptions}>
              More Options
              <Icon
                icon={optionsIcon}
                className={styles.moreOptions_icon}
              />
            </div>
          </Col>
        </Row>
      </Grid>
      {showNoteComponent}
      {//<TimeOffDisplay values={values} />
      }
    </Form>
  );
}

RecurringTimeOffForm.PropTypes = {
  timeOff: PropTypes.object,
  formName: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
};

function mapStateToProps({ form }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      values: {},
    };
  }

  return {
    values: form[formName].values,
  };
}

const enhance = withState('showOption', 'setOption', false)

export default enhance(connect(mapStateToProps,null)(RecurringTimeOffForm));
