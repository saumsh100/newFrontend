
import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import moment from 'moment';
import { connect } from 'react-redux';
import { Form, Field, Icon } from '../../../../library';
import TimeOffDisplay from './TimeOffDisplay';
import styles from './styles.scss';

const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 60;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i++) {
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

const timeOptions = generateTimeOptions();

const setTime = (time) => {
  const tempTime = new Date(time);
  const mergeTime = new Date(1970, 1, 0);
  mergeTime.setHours(tempTime.getHours());
  return mergeTime.toISOString();
};

function TimeOffForm(props) {
  const { timeOff, formName, handleSubmit, values, showOption, setOption } = props;

  const {
    startDate,
    endDate,
    allDay,
    note,
  } = timeOff.toJS();

  const initialValues = {
    startDate: moment(startDate).format('L'),
    endDate: moment(endDate).format('L'),
    allDay,
    startTime: setTime(startDate),
    endTime: setTime(endDate),
    note,
  };

  const validateStartDate = (value) => {
    const sDate = new Date(value);
    const eDate = new Date(values.endDate);
    return (sDate.getDate() > eDate.getDate()) ? 'Start date has to be less than end date.' : undefined;
  };
  const validateEndDate = (value) => {
    const eDate = new Date(value);
    const sDate = new Date(values.startDate);
    return (eDate.getDate() < sDate.getDate()) ? 'End date has to be greater than start date.' : undefined;
  };

  const startTimeComponent = (<Field component="DropdownSelect" options={timeOptions} name="startTime" label="Start Time" disabled={values.allDay} />);
  const endTimeComponent = (<Field component="DropdownSelect" options={timeOptions} name="endTime" label="End Time" disabled={values.allDay} />);
  const showNoteComponent = showOption ? <Field name="note" label="Note" /> : null;

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field
        component="DayPicker"
        name="startDate"
        label="Start Date"
        validate={[validateStartDate]}
      />
      <Field
        component="DayPicker"
        name="endDate"
        label="End Date"
        validate={[validateEndDate]}
      />
      {startTimeComponent}
      {endTimeComponent}
      All Day
      <Field
        component="Toggle"
        name="allDay"
      />
      More Options
      <Icon
        icon="plus"
        onClick={() => setOption(!showOption)}
        className={styles.moreOptions}
      />
      {showNoteComponent}
      <TimeOffDisplay values={values} />
    </Form>
  );
}

TimeOffForm.PropTypes = {
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

export default enhance(connect(mapStateToProps,null)(TimeOffForm));
